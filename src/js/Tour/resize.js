/* globals Tour */

Tour.resize = function() {
    var width = Math.max(window.innerWidth, document.documentElement.scrollWidth);
    var height = Math.max(window.innerHeight, document.documentElement.scrollHeight);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);

    if (this.renderer.setPixelRatio) {
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    this.needsUpdate = true;
    Tour.emmit('resize');
};
