Tour.Arrow = function(point){
    var a = .12; // длинна стрелки
    var b = a-0.03; // толщина стрелки
    var c = 0; // Сдвиг по высоте
    var s = 0.4; // Удаленность от центра
    var n = BrouserInfo.mobile ? 0.15 : 0.05; // Увиличениее интеерактивной зоны

    this.point = point;

    
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


    this.arrow = new THREE.Mesh( geometry, Tour.nadirControl.arrowMaterial);
    var pitch = 0;
    // if(point.level != Tour.getPanorama().heightFromFloor){
        pitch = Math.atan(((Tour.getPanorama().heightFromFloor || 145)-point.level)/point.distance) / 1.5;
    // }
    var d = Math.atan((point.level+1.8)/point.distance)

    var rotation = point.lon * (Math.PI/180);

    this.arrow.rotation._order = "ZYX";
    this.arrow.rotation.z = rotation;
    this.arrow.rotation.y = pitch;
    this.arrow.rotation.x = -pitch;
    Tour.nadirControl.arrows.add(this.arrow);;

    this.shadow = new THREE.Mesh( geometry, Tour.nadirControl.shadowMaterial);
    this.shadow.rotation.copy(this.arrow.rotation)
    Tour.nadirControl.shadows.add(this.shadow);

    this.rect = new THREE.Mesh(rectGeometry);
    this.rect.visible = false;
    this.rect.rotation.copy(this.arrow.rotation);
    this.rect._onclick = this.go.bind(this)
    this.rect._onhover = this.setActive.bind(this, true);
    this.rect._onover = this.setActive.bind(this, false);
    if(Tour.options.arrowsTitle){
        this.rect._title = Lang.translate(Tour.getPanorama(this.point.pano).title);
    }
    Tour.nadirControl.rects.add(this.rect);
}

Tour.Arrow.prototype.setActive = function(value){
    this.arrow.material = value? Tour.nadirControl.activeArrowMaterial : Tour.nadirControl.arrowMaterial;
    Tour.needsUpdate = true;
}

Tour.Arrow.prototype.go = function(){
    Tour.view.set({id:this.point.pano, lon:this.point.panoLon-(this.point.lon-Tour.view.lon.value)}, null, Math.abs((this.point.lon-Tour.view.lon)%360) < 20);
}

Tour.Arrow.prototype.remove = function(){
    Tour.nadirControl.arrows.remove(this.arrow); 
    Tour.nadirControl.shadows.remove(this.shadow); 
    Tour.nadirControl.rects.remove(this.rect); 
}

Tour.nadirControl = {};

Tour.nadirControl.init = function() {
    if (!Tour.options.nadirControl ) {
        return false
    }

    Tour.arrows = [];

    this.group = new THREE.Group();
    this.arrows = new THREE.Group();
    this.shadows = new THREE.Group();
    this.rects = new THREE.Group();

    this.shadows.position.z = -0.03;
    this.group.position.set(0, 0, -2);

    this.group.add(this.arrows);
    this.group.add(this.shadows);
    this.group.add(this.rects);
    Tour.camera.add(this.group);

    this.arrowMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, side: THREE.DoubleSide});
    this.activeArrowMaterial = new THREE.MeshBasicMaterial( { color: 0xe0e0e0, side: THREE.DoubleSide});
    this.shadowMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 0.2} );
}

Tour.nadirControl.getDistance = function(rot1, rot2) {
    var modulo = function(x, y) {
        var xPrime = x;
        while(xPrime < 0) {
          xPrime += y;
        }
        return xPrime % y;
    }

    var distance = Math.abs(modulo(rot1,360) - modulo(rot2,360))
    return distance = Math.min(distance, 360-distance)
}

Tour.nadirControl.getPoints = function() {
    var points = Tour.points || [];

    var result = [];

    if(Tour.options.nadirControlArrowFilter == 'all'){
        points.forEach(function(point){
            result.push(point);
        })
    }else if(Tour.options.nadirControlArrowFilter == 'likePoints'){
        points = points.sort(function(a, b){
            return a.distance - b.distance;
        });

        points.forEach(function(point){
            if(!result.some(function(selected){
                var distance = Tour.nadirControl.getDistance(point.lon, selected.lon) < Tour.options.arrowsDistance
                var anotherLevel = point.distance<1000 && Math.abs(point.level - selected.level) > 50;
                return distance || anotherLevel;
            })){
                result.push(point)
            }
        })
    }else if(Tour.options.nadirControlArrowFilter == 'links'){
        var pano = Tour.getPanorama()

        if(pano.links){
            var arrows = pano.links.map(function(link){
                var point = Tour.getPanorama(link.id);
                var vector
                var lon 
                if(link.x == undefined && link.y == undefined){
                    vector = Tour.utils.getVector(pano, point);
                }else{
                    vector = Tour.utils.getVector(pano, Object.assign({floor: point.floor}, link));
                    lon = Tour.utils.getVector(link, point).rotate
                }
                return {lon:vector.rotate, distance:vector.distance, level:vector.level, pano:point.id, panoLon:lon}
            }).sort(function(a, b){
                return a.distance - b.distance;
            });

            arrows.forEach(function(point){
                if(!result.some(function(selected){
                    var distance = Tour.nadirControl.getDistance(point.lon, selected.lon) < Tour.options.arrowsDistance
                    var anotherLevel = Math.abs(point.level - selected.level) < 50;
                    return distance && anotherLevel;
                })){
                    result.push(point)
                }
            })
        }
    }

    return result;
}


Tour.nadirControl.set = function() {
    if (!Tour.options.nadirControl ) {
        return false
    }

    Tour.arrows.forEach(function(e){
        e.remove();
    })

    Tour.arrows = [];

    var points = this.getPoints();
    points.forEach(function(point) {
        Tour.arrows.push(new Tour.Arrow(point))
    })
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
