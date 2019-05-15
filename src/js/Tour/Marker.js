/* globals Tour, THREE, UI*/

Tour.Marker = function(lat, lon, action, icon, title) {
    UI.Marker.call(this, action, icon, title);

    this.spriteMap = new THREE.TextureLoader().load( "sprite.png" );
    this.spriteMaterial = new THREE.SpriteMaterial( { map: this.spriteMap, depthTest: false, transparent: true} );
    this.sprite = new THREE.Sprite( this.spriteMaterial );
    this.sprite.scale.set(.1, .1, .1);
    this.sprite.marker = this;
    // this.sprite.visible = false;

    this.setLatLon(lat, lon);
    Tour.markersGroup.add( this.sprite);
};

Tour.Marker.prototype = Object.create(UI.Marker.prototype);
Tour.Marker.prototype.constructor = Tour.Marker;

Tour.Marker.prototype.setLatLon = function(lat, lon) {
    this.lat = lat || 0;
    this.lon = lon || 0;

    var x =  -lon / 180 * Math.PI;
    var y = (-lat + 90) / 180 * Math.PI;

    this.vector = new THREE.Vector3(
        Math.cos(x) * Math.sin(y),
        Math.cos(y),
        Math.sin(x) * Math.sin(y)
    );
    this.sprite.position.copy(this.vector);
};

Tour.Marker.prototype.draw = function() {
    var pos = (new THREE.Vector3(this.vector.x , this.vector.y , this.vector.z)).project(Tour.camera);

    if (pos.z < 1) {
        var width = Tour.renderer.domElement.clientWidth / 2;
        var height = Tour.renderer.domElement.clientHeight / 2;

        this.setPosition(
            (pos.x  * width  + width)  / window.devicePixelRatio,
            (-pos.y * height + height) / window.devicePixelRatio
        );
    }
    this.setVisible(pos.z < 1 && !Tour.vrEnabled);
    // this.sprite.visible = !!Tour.vrEnabled;
};
