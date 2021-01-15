Tour.Area = function(options){
	this.options = options;
	this.shape = new THREE.Shape();
    this.shape.moveTo(options.points[0][0], options.points[0][1]);
    for(var i=1; i<options.points.length; i++){
        this.shape.lineTo(options.points[i][0], options.points[i][1]);
    }
    this.shape.lineTo(options.points[0][0], options.points[0][1]);

	this.geometry = new THREE.ShapeGeometry( this.shape );
    if(!Tools.active){
        this.material = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0} );
    }else{
        var texture = new THREE.DataTexture(new Uint8Array([255, 255, 255, 204, 204, 204, 204, 204, 204, 255, 255, 255]), 2, 2, THREE.RGBFormat)

        texture.magFilter = THREE.NearestFilter;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        this.material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, opacity : 0.5} );
    }
    this.mesh = new THREE.Mesh( this.geometry, this.material ) ;
    this.mesh.rotation.set(options.rotation[0], options.rotation[1], options.rotation[2]);
    this.mesh.position.set(options.position[0], options.position[1], options.position[2]);
    this.mesh._onclick = this.go.bind(this)
    this.mesh._onhover = this.setActive.bind(this, true);
    this.mesh._onover = this.setActive.bind(this, false);
    this.mesh._title = options.title || (Tools.active && 'id: '+options.id);

    Tour.areasManager.areas.add( this.mesh );
}

Tour.Area.prototype.go = function(event){
    if(Tools.active && event.altKey){
        var value = prompt('id', this.options.action.id)
        if(value) {
            this.options.action.id = value;
        }else{
            this.options.action = false;
        }
        Tour.areasManager.set(Tour.view.id)
        return false
    }

	var action = this.options.action
	if(action){
	    if (action.type == 'panorama') {
	        Tour.view.set(action, null, Math.abs(Tour.view.lat.value) < 45);
	    } else if (action.type == 'url') {
	        window.open(action.href, action.target || '_blank');
	    } else if (action.type == 'popup') {
	        UI.popUp.set(action.id);
	    }
	}
}

Tour.Area.prototype.setActive = function(value){
	this.material.opacity = value ? 0.2 : (Tools.active?0.5 :0);
	Tour.needsUpdate = true;
}

Tour.areasManager = {};

Tour.areasManager.init = function() {
	this.areas = new THREE.Group();
	Tour.scene.add(this.areas);
}

Tour.areasManager.set = function(id) {
	while(this.areas.children.length > 0){ 
        this.areas.remove(this.areas.children[0]);
    }

    Tour.areas = [];
    var areas = Tour.getPanorama(id).areas || [];
    areas.forEach(function(areaOptions) {
        if(!areaOptions.action){
            return false;
        }
        var area = new Tour.Area(areaOptions);
        Tour.areas.push(area);
    })

    Tour.needsUpdate = true;
}

