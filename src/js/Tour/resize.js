/* globals Tour */

Tour.resize = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);

    if (this.renderer.setPixelRatio) {
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    this.needsUpdate = true;
    Tour.emmit('resize');
};
