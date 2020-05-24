/* globals Tour, Lang, UI */

Tour.Point = function(options, index){
    this.material = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true} );
    this.materialActive = new THREE.MeshBasicMaterial( { color: 0xffffff} );

    this.ringGeometry = new THREE.RingGeometry( 0.3, 0.4, 32 );
    this.ring = new THREE.Mesh( this.ringGeometry, this.material );
    this.ring.rotation.set(-Math.PI/2, 0, 0);

    this.circleGeometry = new THREE.CircleGeometry( 0.4, 16 );
    this.circle = new THREE.Mesh( this.circleGeometry);
    this.circle.visible = false;
    this.circle.rotation.set(-Math.PI/2, 0, 0);

    this.level = options.level || -2;
    this.opacity = options.opacity || 1;
    this.distance = options.distance || 0
    this.lon = options.lon || 0;

    Tour.pointsManager.rings.add(this.ring);
    Tour.pointsManager.circles.add(this.circle);
    this.set();
}


Tour.Point.prototype.set = function(){
    var n = this.lon * ( Math.PI / 180) + (Math.PI/2);
    this.material.opacity = this.opacity * Tour.options.pointersOpacity * (1-(this.distance/20));
    this.ring.position.set(Math.sin(n)*this.distance, this.level, Math.cos(n)*this.distance);
    this.circle.position.set(Math.sin(n)*this.distance, this.level, Math.cos(n)*this.distance);
}

Tour.Point.prototype.remove = function(){

}

Tour.pointsManager = {};

Tour.pointsManager.init = function() {
    this.rings = new THREE.Group();
    this.circles = new THREE.Group();
    this.move = false;

    Tour.scene.add(this.rings);
    Tour.scene.add(this.circles);
    Tour.points = [];

    Tour.renderer.domElement.addEventListener('mousemove', this.onMouseMowe.bind(this), false);
    Tour.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    Tour.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
}

Tour.pointsManager.set = function(id) {
    while(this.rings.children.length > 0){ 
        this.rings.remove(this.rings.children[0]); 
        this.circles.remove(this.circles.children[0]); 
    }
    Tour.points = [];

    var points = Tour.getPanorama(id).points || [];
    points.forEach(function(pointOptions) {
        var point = new Tour.Point(pointOptions);
        Tour.points.push(point);
    })
    Tour.needsUpdate = true;
}

Tour.pointsManager.onMouseDown = function(event){
    this.detectPoint(event);
    this.move = false;
}


Tour.pointsManager.onMouseUp = function(event){
    this.detectPoint(event);
    if(this.aciveIndex >= 0 && !this.move) {
        var point = Tour.getPanorama().points[this.aciveIndex];
        Tour.view.set({id:point.pano}, null, Math.abs(point.lon - Tour.view.lon) < 20);
    }
    UI.layout.setActive(true);
}

Tour.pointsManager.onMouseMowe = function(event){
    this.move = true;
    this.detectPoint(event);
}

Tour.pointsManager.detectPoint = function(event){
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, Tour.camera);
    var intersects = raycaster.intersectObjects(this.circles.children);

    if(intersects.length){
        UI.layout.setActive(true);
    }

    this.circles.children.forEach(function(circle, index) {
        if(intersects[0] && circle.id == intersects[ 0 ].object.id){
            this.aciveIndex = index
            if(this.rings.children[index].material == Tour.points[index].material){
                this.rings.children[index].material = Tour.points[index].materialActive;
                Tour.needsUpdate = true;
            }
        }else if(this.rings.children[index].material != Tour.points[index].material) {
            this.rings.children[index].material = Tour.points[index].material;
            Tour.needsUpdate = true;
        }
    }.bind(this));

    if(!intersects[0]){
        this.aciveIndex = -1;
    }
}



