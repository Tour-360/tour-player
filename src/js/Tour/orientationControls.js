/* globals THREE, Tour, UI */

Tour.orientationControls = {
    init: function() {
        if (window.isSecureContext) {
            this.controls = new THREE.DeviceOrientationControls(Tour.camera);
            this.controls.disconnect();
            window.addEventListener('deviceorientation', this.detectDevice);
        }
    },
    set: function(value){
        var ctrl = this.controls;

        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(function(permissionState){
                if (permissionState == 'DeviceOrientation') {
                    if(!ctrl.enabled && value){
                        ctrl.connect();
                    }else if(ctrl.enabled && !value){
                        ctrl.disconnect();
                    }
                }
            }).catch(function(permissionState){
                ctrl.disconnect();
            });
        }
    },
    toggle: function(){
        this.set(!this.controls.enabled)
    },
    detectDevice: function(event) {
        if (event.alpha) {
            UI.controlPanel.addBtn('rotate', Tour.controls.toggleControls, '');
        }
        window.removeEventListener('deviceorientation', Tour.orientationControls.detectDevice);
    }
};
