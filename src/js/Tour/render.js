/* globals Tour*/

Tour.render = function() {
    this.renderer.render(this.scene, this.camera);
    if (this.markers) {
        this.markers.forEach(function(marker) {
            marker.draw();
        });
    }
};
