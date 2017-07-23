/* globals Tour, UI, THREE*/

Tour.render = function() {
    this.renderer.render(this.scene, this.camera);
    UI.controlPanel.setOrientation(Math.floor(THREE.Math.radToDeg(Tour.camera.rotation.z)));
    if (this.markers) {
        this.markers.forEach(function(marker) {
            marker.draw();
        });
    }
};
