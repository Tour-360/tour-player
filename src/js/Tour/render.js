/* globals Tour, UI, THREE*/

Tour.render = function() {

    var compare = function(a, b) {
        return !(Math.abs(a - b) < 1e-4);
    };

    if (!this.previousCamera || this.needsUpdate ||
        compare(this.camera.rotation.x, this.previousCamera.x) ||
        compare(this.camera.rotation.y, this.previousCamera.y) ||
        compare(this.camera.rotation.z, this.previousCamera.z) ||
        compare(this.camera.fov,        this.previousCamera.f)
    ) {
        var n = Date.now();
        this.renderer.render(this.scene, this.camera);
        this.renderers.forEach(function(render) {
            render.renderer.render(render.scene || this.scene, render.camera || this.camera);
        }.bind(this));
        if (window.isSecureContext) {
            UI.controlPanel.setOrientation(Math.floor(THREE.Math.radToDeg(Tour.camera.rotation.z)));
        }

        if (this.markers) {
            this.markers.forEach(function(marker) {
                marker.draw();
            });
        }
        this.needsUpdate = false;
        if (this.videos) {
            for (k in this.videos) {
                this.videos[k].draw();
            }
        }
        Tour.emmit('render');
    }

    this.previousCamera = (new THREE.Vector4()).copy(this.camera.rotation);
    this.previousCamera.f = this.camera.fov;

};
