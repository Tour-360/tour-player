/* globals Tour*/

Tour.render = function() {
    this.renderer.render(this.scene, this.camera);
    this.markers.forEach(function(marker) {
        marker.draw();
    });
};
