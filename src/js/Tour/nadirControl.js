
Tour.nadirControl = {};

Tour.nadirControl.init = function() {
    if (!Tour.options.nadirControl ) {
        return false
    }
    this.aciveIndex = -1;
    this.move =  false;
    this.group = new THREE.Group();
    this.arrows = new THREE.Group();
    this.shadows = new THREE.Group();
    this.rects = new THREE.Group();
    this.group.position.set(0, 0, -2);
    this.group.add(this.arrows);
    this.group.add(this.shadows);
    this.group.add(this.rects);
    Tour.camera.add(this.group);

    Tour.renderer.domElement.addEventListener('mousemove', this.onMouseMowe.bind(this), false);
    Tour.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    Tour.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);

    this.arrowMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, side: THREE.DoubleSide});
    this.acttiveArrowMaterial = new THREE.MeshBasicMaterial( { color: 0xe0e0e0, side: THREE.DoubleSide});
    this.shadowMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 0.2} );
}

Tour.nadirControl.onMouseDown = function(event){
    this.onMouseMowe(event)
    this.move = false;
}

Tour.nadirControl.onMouseUp = function(event){
    if(this.aciveIndex >=0 && !this.move){
        var point = this.points[this.aciveIndex];
        Tour.view.set({id:point.pano}, null, Math.abs((point.lon%360) - (Tour.view.lon%360)) < 20);
        this.aciveIndex = -1
    }
}

Tour.nadirControl.onMouseMowe = function(event){
    this.move = true;
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, Tour.camera);
    var intersects = raycaster.intersectObjects(this.rects.children);

    if(intersects.length){
        UI.layout.setActive(true);
    }

    this.arrows.children.forEach(function(arrow, index) {
        if(intersects[0] && index == intersects[ 0 ].object.index){
            this.aciveIndex = intersects[ 0 ].object.index
            if(arrow.material == this.arrowMaterial){
                arrow.material = this.acttiveArrowMaterial;
                Tour.needsUpdate = true;
            }
        }else if(arrow.material != this.arrowMaterial) {
            arrow.material = this.arrowMaterial;
            Tour.needsUpdate = true;
        }
    }.bind(this));

    if(!intersects[0]){
        this.aciveIndex = -1;
    }
}

Tour.nadirControl.getPoints = function() {
    var points = Tour.getPanorama().points || [];
    points = points.sort(function(a, b){
        return a.distance - b.distance;
    });

    var result = [];
    points.forEach(function(point){
        if(!result.some(function(selected){
            return Math.abs((point.lon+360)%360 - (selected.lon+360)%360) < Tour.options.arrowsDistance;
        })){
            result.push(point)
        }
    })
    return result;
}


Tour.nadirControl.set = function() {
    if (!Tour.options.nadirControl ) {
        return false
    }

    while(this.arrows.children.length > 0){ 
        this.arrows.remove(this.arrows.children[0]); 
        this.shadows.remove(this.shadows.children[0]); 
        this.rects.remove(this.rects.children[0]); 
    }

    var a = .12; // длинна стрелки
    var b = a-0.03; // толщина стрелки
    var c = 0; // Сдвиг по высоте
    var s = 0.4; // Удаленность от центра
    var n = 0.05; // Увиличениее интеерактивной зоны

    
    var vertices = new Float32Array( [
        -a-s, -a-s, c,   a-s, -a-s, c,   a-s, -b-s, c,
        -a-s, -a-s, c,   a-s, -b-s, c,  -b-s, -b-s, c,
        -a-s,  a-s, c,  -a-s, -a-s, c,  -b-s, -b-s, c,
        -a-s,  a-s, c,  -b-s, -b-s, c,  -b-s,  a-s, c,
    ]);
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute( vertices, 3 ) );


    var rectVertices = new Float32Array( [
        -a-s-n, -a-s-n, c,   a-s+n, -a-s-n, c,   a-s+n, -b-s+n, c,
        -a-s-n, -a-s-n, c,   a-s+n, -b-s+n, c,  -b-s+n, -b-s+n, c,
        -a-s-n,  a-s+n, c,  -a-s-n, -a-s-n, c,  -b-s+n, -b-s+n, c,
        -a-s-n,  a-s+n, c,  -b-s+n, -b-s+n, c,  -b-s+n,  a-s+n, c,
    ]);
    var rectGeometry = new THREE.BufferGeometry();
    rectGeometry.setAttribute( 'position', new THREE.BufferAttribute( rectVertices, 3 ) );

    this.points = this.getPoints();

    this.points.forEach(function(point, markerId) {
        var index = this.arrows.children.length;
        var rotation = point.lon * (Math.PI/180);

        var arrow = new THREE.Mesh( geometry, this.arrowMaterial);

        var pitch = 0;
        if(point.level != -Tour.options.heightFloor){
            pitch = Math.atan((point.level+Tour.options.heightFloor)/point.distance) / 1.5;
        }

        var d = Math.atan((point.level+1.8)/point.distance)

        arrow.rotation._order = "ZYX";
        arrow.rotation.z = rotation;
        arrow.rotation.y = pitch;
        arrow.rotation.x = -pitch;

        this.arrows.add(arrow);;

        var shadow = new THREE.Mesh( geometry, this.shadowMaterial);
        shadow.rotation.copy(arrow.rotation)
        this.shadows.add(shadow);;

        var rect = new THREE.Mesh(rectGeometry);
        rect.visible = false;
        rect.index = index;
        rect.rotation.copy(arrow.rotation);
        this.rects.add(rect);
    }.bind(this))

    this.shadows.position.z = -0.03;
}


Tour.nadirControl.update = function() {
    if (!Tour.options.nadirControl ) {
        return false
    }
    this.group.rotation.set(-Math.PI/2-Tour.camera.rotation.x, 0, -Tour.camera.rotation.y-4);
    this.group.position.y = (1+Tour.camera.rotation.x/(Math.PI/2))*-1.2;

    var start = 20
    var end = 30
    var opacity = 1 - (Math.min(Math.max(0, Tour.view.lat.value-start), end-start) / (end-start))
    this.arrowMaterial.opacity = opacity;
    this.shadowMaterial.opacity = opacity * 0.2
}

