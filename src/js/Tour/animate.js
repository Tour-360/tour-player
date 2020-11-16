/* globals Tour, THREE */

Tour.animate = function() {
    requestAnimationFrame(Tour.animate.bind(this));
    if (this.view.rotation.auto) {
        if (Math.abs(this.view.rotation.lon) < Math.abs(this.options.autorotationSpeed)) {
            this.view.rotation.lon += this.options.autorotationSpeed / 100;
        }
        if (this.options.autorotationAlign) {
            this.view.lat.set(this.view.lat.value / 1.01);
            this.view.fov.set(90 + ((this.view.fov.value - 90) / 1.005));
        }
    } else {
        this.view.rotation.lon /= this.options.kineticResistance;
        this.view.rotation.lat /= this.options.kineticResistance;
        if (Math.abs(Tour.view.rotation.lon) > 1e-5 || Math.abs(Tour.view.rotation.lon) > 1e-5) {
            Tour.emmit('moveview');
        }
    }

    Tour.view.lat.max = Tour.options.limit.lat.max-((Tour.view.fov.value)/2);
    Tour.view.lat.min = Tour.options.limit.lat.min+((Tour.view.fov.value)/2);
    Tour.view.lon.max = Tour.options.limit.lon.max-(Tour.view.fov.value/2);
    Tour.view.lon.min = Tour.options.limit.lon.min+(Tour.view.fov.value/2);

    this.view.lat.move(this.view.rotation.lat, true);
    this.view.lon.move(this.view.rotation.lon, true);

    var phi = THREE.Math.degToRad(90 - this.view.lat.value);
    var theta = THREE.Math.degToRad(-this.view.lon.value);
    var target = new THREE.Vector3(); //! Вынести!

    target.x = Math.sin(phi) * Math.cos(theta);
    target.y = Math.cos(phi);
    target.z = Math.sin(phi) * Math.sin(theta);

    if (window.isSecureContext && this.orientationControls.controls.enabled) {
        this.orientationControls.controls.update();
    } else {
        this.camera.lookAt(target);
    }

    this.camera.fov = this.view.fov.value;
    this.camera.updateProjectionMatrix();

    this.nadirControl.update();

    for (var k in this.view) {
        if (typeof this.view[k] == 'object') {
            this.view[k].animate();
        }
    }
    Tour.emmit('animate');
    this.render();
};
