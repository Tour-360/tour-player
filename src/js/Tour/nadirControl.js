Tour.generateArrow = function(){
    var a = .12; // Длина стрелки
    var w = 0.03 // Толщина стрелки
    var c = 0;   // Сдвиг по высоте
    var s = 0.4; // Удаленность от центра
    var x = .15  // Длина центральной части
    var n = BrouserInfo.mobile ? 0.15 : 0.05; // Увиличениее интеерактивной зоны

    var e = (w/2/Math.SQRT2)
    var f = (w/2*Math.SQRT2)
    var j = (x*Math.SQRT2)

    // prettier-ignore
    var p = [
        [-a-s,   -a-s],   // 0
        [-a-s,    a-s],   // 1
        [-a+w-s,  a-s],   // 2
        [-a+w-s, -a+w-s], // 3
        [a-s,    -a+w-s], // 4
        [a-s,    -a-s],   // 5

        [-a+w-s+f,   -a+w-s],     // 6
        [-a+w-s+j+e, -a+w-s+j-e], // 7
        [-a+w-s+j-e, -a+w-s+j+e], // 8
        [-a+w-s,     -a+w-s+f]    // 9
    ]

    var q = (n*Math.SQRT2)

    // prettier-ignore
    return {
        arrow: new Float32Array( [
            p[0][0], p[0][1], c,  p[5][0], p[5][1], c,  p[4][0], p[4][1], c,
            p[0][0], p[0][1], c,  p[4][0], p[4][1], c,  p[3][0], p[3][1], c,
            p[1][0], p[1][1], c,  p[0][0], p[0][1], c,  p[3][0], p[3][1], c,
            p[1][0], p[1][1], c,  p[3][0], p[3][1], c,  p[2][0], p[2][1], c,
            // p[3][0], p[3][1], c,  p[6][0], p[6][1], c,  p[7][0], p[7][1], c,
            // p[3][0], p[3][1], c,  p[9][0], p[9][1], c,  p[8][0], p[8][1], c,
            // p[3][0], p[3][1], c,  p[7][0], p[7][1], c,  p[8][0], p[8][1], c,
        ]),
        interactive: new Float32Array( [
            -n, -n, 0,  +n,   -n,   0, +n, +n, 0,
            -n, -n, 0,  +n,   +n,   0, +n, +n, 0,
            -n, +n, 0,  -n,   -n,   0, +n, +n, 0,
            -n, +n, 0,  +n,   +n,   0, +n, +n, 0,
            // +n, +n, 0,  +n+q, +n,   0, +q,  0, 0,
            // +n, +n, 0,  +n,   +n+q, 0,  0, +q, 0,
            // +n, +n, 0,  +q,    0,   0,  0, +q, 0,
        ]),

        interactiveVisible: false
    }
}


Tour.Arrow = function(point){

    this.point = point;

    var vertices = Tour.generateArrow()

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute( vertices.arrow, 3 ) );

    var rectGeometry = new THREE.BufferGeometry();
    rectGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices.arrow.map(function(n, i){
        return n+vertices.interactive[i]
    }), 3 ) );


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

    this.rect = new THREE.Mesh(rectGeometry, new THREE.MeshBasicMaterial( { color: 0xff0000, transparent: true, opacity: .5, side: THREE.DoubleSide} ));
    this.rect.visible = vertices.interactiveVisible;
    this.rect.rotation.copy(this.arrow.rotation);
    this.rect._onclick = this.go.bind(this)
    this.rect._onhover = this.setActive.bind(this, true);
    this.rect._onover = this.setActive.bind(this, false);
    this.rect._intersectsOrder = 1;
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
    Tour.view.set({id:this.point.pano, lon:this.point.panoLon-(this.point.lon-Tour.view.lon.value)}, null, Math.abs((this.point.lon-Tour.view.lon)%360) < 20 && Math.abs(Tour.view.lat) < 45);
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

    this.arrowMaterial = this.arrowMaterial || new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, side: THREE.DoubleSide});
    this.activeArrowMaterial = this.activeArrowMaterial || new THREE.MeshBasicMaterial( { color: 0xe0e0e0, transparent: true, side: THREE.DoubleSide});
    this.shadowMaterial = this.shadowMaterial || new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 0.2} );
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
    this.group.rotation.set(-Math.PI/2-Tour.camera.rotation.x, Tour.camera.rotation.z, -Tour.camera.rotation.y-4);
    this.group.position.y = (1+Tour.camera.rotation.x/(Math.PI/2))*-1.2;

    var start = 20
    var end = 30
    var opacity = 1 - (Math.min(Math.max(0, Tour.view.lat.value-start), end-start) / (end-start))
    this.arrowMaterial.opacity = opacity;
    this.shadowMaterial.opacity = opacity * 0.2
}
