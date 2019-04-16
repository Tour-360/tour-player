/* globals THREE, Tour, UI */

Tour.orientationControls = {
    init: function() {
        if (window.isSecureContext) {
            this.controls = new THREE.DeviceOrientationControls(Tour.camera);
            this.controls.disconnect();
            window.addEventListener('deviceorientation', this.detectDevice);
        }
    },
    detectDevice: function(event) {
        if (event.alpha) {
            UI.controlPanel.addBtn('rotate', Tour.controls.toggleControls, '');
        }
        window.removeEventListener('deviceorientation', Tour.orientationControls.detectDevice);
    }
};
