/* globals Tour, UI, THREE*/

Tour.render = function() {

    if(!this.previousCamera || this.needsUpdate ||
        this.previousCamera.x != this.camera.rotation.x ||
        this.previousCamera.y != this.camera.rotation.y ||
        this.previousCamera.z != this.camera.rotation.z ||
        this.previousCamera.w != this.camera.fov
    ){
        this.renderer.render(this.scene, this.camera);
        UI.controlPanel.setOrientation(Math.floor(THREE.Math.radToDeg(Tour.camera.rotation.z)));
        if (this.markers) {
            this.markers.forEach(function(marker) {
                marker.draw();
            });
        }
        Tour.emmit('render');
        this.needsUpdate = false;
    }
    
    this.previousCamera = (new THREE.Vector4()).copy(this.camera.rotation);
    this.previousCamera.w = this.camera.fov;

};
