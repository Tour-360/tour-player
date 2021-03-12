/* globals THREE, Tour, UI */

Tour.orientationControls = {
    init: function() {
        this.isSupported = window.isSecureContext && BrouserInfo.mobile;
        if (window.isSecureContext) {
            this.controls = new THREE.DeviceOrientationControls(Tour.camera);
            this.controls.disconnect();
            window.addEventListener('deviceorientation', function(event){
                Tour.emmit('deviceOrientation', event);
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
                        Tour.emmit('deviceOrientationChange', true);
                    }else if(ctrl.enabled && !value){
                        ctrl.disconnect();
                        Tour.emmit('deviceOrientationChange', false);
                        Tour.orientationControls.orientation = null;
                    }
                }
            }).catch(function(permissionState){
                ctrl.disconnect();
                Tour.emmit('deviceOrientationChange', false);
                Tour.orientationControls.orientation = null;
            });
        }
    },
    toggle: function(){
        this.set(!this.controls.enabled)
    }
};
