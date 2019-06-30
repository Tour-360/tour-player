/* globals Tour, THREE, UI*/

Tour.Marker = function(lat, lon, action, icon, title) {
    UI.Marker.call(this, action, icon, title);
    this.setLatLon(lat, lon);
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
};

Tour.Marker.prototype.draw = function() {
    var pos = this.vector.clone().project(Tour.camera);

    var width = Tour.clientWidth / 2;
    var height = Tour.clientHeight / 2;

    if (pos.z < 1) {
        var rotation = THREE.Math.radToDeg(Tour.camera.rotation.z);

        this.setPosition(
            (pos.x  * width  + width),
            (-pos.y * height + height)
        );

        var oc = Tour.orientationControls;
        if (oc && oc.controls && oc.controls.enabled) {
            this.setRotation(rotation);
        }
    } else {
        this.setVisible(false);
    }
};
