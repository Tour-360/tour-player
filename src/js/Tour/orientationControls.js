/* globals THREE, Tour, UI */

Tour.orientationControls = {
    init: function() {
        this.isSupported = false;
        if (window.isSecureContext) {
            this.controls = new THREE.DeviceOrientationControls(Tour.camera);
            this.controls.disconnect();
            window.addEventListener('deviceorientation', this.detectDevice);
            window.addEventListener('deviceorientation', function(event){
                Tour.emit('deviceOrientation', event);
                Tour.orientationControls.orientation = event; 
            });
        }
    },
    set: function(value){
        var ctrl = this.controls;

        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(function(permissionState){
                if (permissionState == 'granted') {
                    if(!ctrl.enabled && value){
                        ctrl.connect();
                        Tour.emit('deviceOrientationChange', true);
                    }else if(ctrl.enabled && !value){
                        ctrl.disconnect();
                        Tour.emit('deviceOrientationChange', false);
                        Tour.orientationControls.orientation = null;
                    }
                }
            }).catch(function(permissionState){
                ctrl.disconnect();
                Tour.emit('deviceOrientationChange', false);
                Tour.orientationControls.orientation = null;
            });
        }
    },
    toggle: function(){
        this.set(!this.controls.enabled)
    },
    detectDevice: function(event) {
        if (event.alpha) {
            UI.controlPanel.addBtn('rotate', Tour.controls.toggleControls, '');
            Tour.orientationControls.isSupported = true;
        }
        window.removeEventListener('deviceorientation', Tour.orientationControls.detectDevice);
    }
};
