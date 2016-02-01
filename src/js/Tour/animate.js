/* globals Tour, THREE */

Tour.animate = function() {
    requestAnimationFrame(Tour.animate.bind(this));

    if (this.view.rotation.auto && Math.abs(this.view.rotation.lon) < Math.abs(this.options.autorotationSpeed)) {
        this.view.rotation.lon += this.options.autorotationSpeed/1000;
    } else if (!this.view.rotation.auto) {
        this.view.rotation.lon /= 1.10;
        this.view.rotation.lat /= 1.10;
    }

    this.view.lat.move(this.view.rotation.lat, this.view.rotation.lat > 0.01);
    this.view.lon.move(this.view.rotation.lon, this.view.rotation.lat > 0.01);

    var phi = THREE.Math.degToRad(90 - this.view.lat.value);
    var theta = THREE.Math.degToRad(-this.view.lon.value);
    var target = new THREE.Vector3(); //! Вынести!

    target.x = Math.sin(phi) * Math.cos(theta);
    target.y = Math.cos(phi);
    target.z = Math.sin(phi) * Math.sin(theta);

    this.camera.lookAt(target);
    this.camera.fov = this.view.fov.value;
    this.camera.projectionMatrix.makePerspective(this.camera.fov, this.camera.aspect, 1, 1100);

    for (var k in this.view) {
        if (typeof this.view[k] == 'object') {
            this.view[k].animate();
        }
    }

    this.render();
};
