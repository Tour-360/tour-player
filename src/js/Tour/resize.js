/* globals Tour */

Tour.resize = function() {
    this.clientReact = this.domElement.getBoundingClientRect();
    this.width = this.clientReact.width;
    this.height = this.clientReact.height;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.clientWidth = this.width;
    this.clientHeight = this.height;

    this.renderer.setSize(this.width, this.height);

    if (this.renderer.setPixelRatio) {
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    this.needsUpdate = true;
    Tour.emmit('resize');
};
