/* globals Tour, THREE */

Tour.animate = function() {
    requestAnimationFrame(Tour.animate.bind(this));

    var phi = THREE.Math.degToRad(90 - this.view.lat.value);
    var theta = THREE.Math.degToRad(this.view.lon.value);
    var target = new THREE.Vector3(); //! Вынести!

    target.x = Math.sin(phi) * Math.cos(theta);
    target.y = Math.cos(phi);
    target.z = Math.sin(phi) * Math.sin(theta);

    this.camera.lookAt(target);

    Tour.camera.projectionMatrix.makePerspective(Tour.view.fov.value, this.camera.aspect, 1, 1100);

    for (var k in this.view) {
        if (typeof this.view[k] == 'object') {
            this.view[k].animate();
        }
    }

    this.render();
};
