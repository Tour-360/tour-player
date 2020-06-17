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
    this.opacity = options.opacity || 1;
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
    this.material.opacity = this.opacity * Tour.options.pointersOpacity * (1-(this.distance/20));
    this.ring.position.set(Math.sin(n)*this.distance, this.level, Math.cos(n)*this.distance);
    this.circle.position.set(Math.sin(n)*this.distance, this.level, Math.cos(n)*this.distance);
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

    var points = Tour.getPanorama(id).points || [];
    points.forEach(function(pointOptions) {
        Tour.points.push(new Tour.Point(pointOptions));
    })
    Tour.needsUpdate = true;
}
