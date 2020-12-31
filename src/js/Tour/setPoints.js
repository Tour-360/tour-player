/* globals Tour, Lang, UI */

Tour.Point = function(options, index){
    this.material = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true} );
    this.materialActive = new THREE.MeshBasicMaterial( { color: 0xffffff} );

    this.ringGeometry = new THREE.RingGeometry( 0.3, 0.38, 32 );
    this.ring = new THREE.Mesh( this.ringGeometry, this.material );
    this.ring.rotation.set(-Math.PI/2, 0, 0);

    this.circleGeometry = new THREE.CircleGeometry( 0.4, 16 );
    this.circle = new THREE.Mesh( this.circleGeometry);
    this.circle.visible = false;
    this.circle.rotation.set(-Math.PI/2, 0, 0);

    this.circle._onclick = this.go.bind(this)
    this.circle._onhover = this.setActive.bind(this, true);
    this.circle._onover = this.setActive.bind(this, false);

    this.level = options.level || -2;
    this.opacity = options.opacity == undefined ? 1 : (options.opacity || 0);
    this.distance = options.distance || 0
    this.lon = options.lon || 0;
    this.pano = options.pano;

    Tour.pointsManager.rings.add(this.ring);
    Tour.pointsManager.circles.add(this.circle);
    this.set();
}

Tour.Point.prototype.go = function(value){
    Tour.view.set({id:this.pano}, null, Math.abs((this.lon - Tour.view.lon)%360) < 20);
}

Tour.Point.prototype.setActive = function(value){
    this.ring.material = value ? this.materialActive : this.material;
    Tour.needsUpdate = true;
}


Tour.Point.prototype.set = function(){
    var n = this.lon * ( Math.PI / 180) + (Math.PI/2);
    this.material.opacity = this.opacity * Tour.options.pointersOpacity * (1-this.distance/2000);
    this.ring.position.set(Math.sin(n)*this.distance/100, -this.level/100, Math.cos(n)*this.distance/100);
    this.circle.position.set(Math.sin(n)*this.distance/100, -this.level/100, Math.cos(n)*this.distance/100);
}

Tour.Point.prototype.remove = function(){
    Tour.pointsManager.rings.remove(this.ring);
    Tour.pointsManager.circles.remove(this.circle);
}

Tour.pointsManager = {};

Tour.pointsManager.init = function() {
    this.rings = new THREE.Group();
    this.circles = new THREE.Group();

    Tour.scene.add(this.rings);
    Tour.scene.add(this.circles);
    Tour.points = [];
}


Tour.pointsManager.set = function(id) {
    Tour.points.forEach(function(e){
        e.remove();
    })
    Tour.points = [];

    if(Tour.options.points){
        var points = Tour.getPanorama(id).points || [];
        points.forEach(function(pointOptions) {
            Tour.points.push(new Tour.Point(pointOptions));
        })
        Tour.needsUpdate = true;
    }

    if(Tour.options.autoPoints){
        var pano = Tour.getPanorama(id);
        if(Tour.options.hideInvisiblePoints){//todo wals
            var visibility = Tour.utils.getVisibilityPoint({id:pano.id})
        }

        Tour.data.panorams.forEach(function(point){
          var newPoint = Tour.utils.getVector(pano, point);

          if(
            newPoint.distance!=0 && 
            newPoint.rotate<2000 && 
            point.floor > pano.floor-1 && 
            point.floor < pano.floor+1 &&
            (visibility? visibility[point.id] : true)
           ){
            Tour.points.push(new Tour.Point({lon: newPoint.rotate, distance:newPoint.distance, level:newPoint.level, pano:point.id}));
          }
        })
    }
}

Tour.utils = {};
Tour.utils.getVector = function(pano1, pano2){
    var a = pano1.x-pano2.x;
    var b = pano1.y-pano2.y;
    var distance = Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
    var rotate = -THREE.Math.radToDeg(Math.atan2(b, a))+90;
    var result = {distance:distance, rotate:rotate, id: pano2.id};
    if(pano1.heightFromFloor != undefined && pano1.floor != undefined && pano2.floor != undefined ){
        result.level = pano1.heightFromFloor + (pano1.floor != pano2.floor?(Tour.utils.getHeight(pano1.floor) - Tour.utils.getHeight(pano2.floor)) : 0);
    }
    return result
}


Tour.utils.getVisibilityPoint = function(vector, result, index){
    if(!index)index = 0;
    if(index>5) return {};

    var pano = Tour.getPanorama(vector.id);
    var result = result || {};
    if(pano.links){
        pano.links.forEach(function(link){
            var pano2 = Tour.getPanorama(link.id);
            var vector2 = Tour.utils.getVector(pano, pano2);
            var offset = Math.abs(Tour.utils.getAngleOffset(vector.rotate, vector2.rotate));
            if(!link.hidePoint && (offset < 40 || !offset)){
                result[vector2.id] = true;
                Tour.utils.getVisibilityPoint(vector2, result, index+1)
            }
        })
    }
    return result
}

Tour.utils.getAngleOffset = function(rot1, rot2) {
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

Tour.utils.getHeight = function(n){
    return [0].concat(Tour.data.floors.slice(0, Math.floor(n))
    .map(function(n){return n.height}))
    .reduce(function(a, b){return a+b}) + (Tour.data.floors[Math.floor(n)].height * (n-Math.floor(n)))
}
