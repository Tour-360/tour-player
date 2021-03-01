/* globals Tour*/

Tour.mouseEvents = {};

Tour.mouseEvents._setCinetic = function(event) {
    if (
        (event.pageX || event.pageY) &&
        (event.scale == undefined || event.scale == 1) &&
        (event.touches == undefined || event.touches.length == 1) &&
        !(this.previousEvent.pageX == event.pageX && this.previousEvent.pageY == event.pageY)
    ) {
        var alpha = Tour.view.fov.value / Tour.options.initFov / Tour.options.mouseSensitivity;
        this.cineticLon = (event.pageX - this.previousEvent.pageX) * alpha;
        this.cineticLat = (event.pageY - this.previousEvent.pageY) * alpha;
    } else if (event.timeStamp - this.previousEvent.timeStamp > 40) {
        this.cineticLon = this.cineticLat = 0;
    }
    this.previousEvent = event;
};


Tour.mouseEvents.wheel = function(event) {

    var isIframe = !(window.parent && window.parent == window);

    if (
        this.options.scaleControl &&
        (this.options.iFrameScaleControl || !isIframe) &&
        event.composed && event.deltaY
    ) {
        this.controls.autoRotate(false);
        if (event.defaultPrevented) {
            event.preventDefault();
        }
        this.view.fov.move(event.deltaY * (event.deltaMode ? 10 / 3 : 0.1));

        clearTimeout(this.mouseEvents.zoomTimeout);

        this.mouseEvents.zoomTimeout = setTimeout(function() {
            Tour.history.set();
        }, 300);
    }

    event.preventDefault();
};

Tour.mouseEvents.down = function(event) {
    if (this.options.touchScroll && event.type == 'touchstart') {
        return false;
    }
    if (event.which == 2) {
        event.preventDefault();
        return false;
    }

    // this.mouseEvents._touches2mouse(event);

    this.mouseEvents.drag = true;
    this.controls.autoRotate(false);
    this.mouseEvents.previousEvent = event;
    Tour.emmit('touchstart');
    event.preventDefault();
};

Tour.mouseEvents.move = function(event) {
    if(event.touches && event.touches.length >= 2){
        if(!this.mouseEvents.startFov){
            Tour.mouseEvents.gesturestart(event);
        }else{
            event.scale = Tour.mouseEvents.getDistance(event)/Tour.mouseEvents.startDistance;
            Tour.mouseEvents.gesturechange(event)
        }
    }else if(this.mouseEvents.drag && (event.touches ? this.options.touchDrag : true)) {
        // this.mouseEvents._touches2mouse(event);

        var alpha = 4.5 / (Math.PI / Math.tan((Tour.view.fov.value/ 180 * Math.PI) / 2)) / Tour.options.mouseSensitivity;
        this.view.lon.set(this.view.lon.value + (event.pageX - this.mouseEvents.previousEvent.pageX) * alpha);
        this.view.lat.set(this.view.lat.value + (event.pageY - this.mouseEvents.previousEvent.pageY) * alpha);
        this.mouseEvents._setCinetic(event);
        Tour.emmit('touchmove');
    }
    event.preventDefault();
};

Tour.mouseEvents.up = function(event) {
    if (this.mouseEvents.drag && !this.mouseEvents.startDistance) {
        this.mouseEvents._setCinetic(event);

        this.view.rotation.lat = this.mouseEvents.cineticLat;
        this.view.rotation.lon = this.mouseEvents.cineticLon;

        this.history.set();
        Tour.emmit('touchend');
    }

    this.mouseEvents.cineticLon = this.mouseEvents.cineticLat = 0;
    this.mouseEvents.drag = false;
    this.mouseEvents.startFov = 0;
    this.mouseEvents.startDistance = 0;
    event.preventDefault();
};


Tour.mouseEvents.getDistance = function(event){
    var w = Math.abs(event.touches[0].pageX - event.touches[1].pageX);
    var h = Math.abs(event.touches[0].pageY - event.touches[1].pageY);

    return Math.sqrt(w*w + h*h)
}


Tour.mouseEvents.gesturestart = function(event) {
    Tour.mouseEvents.startFov = Tour.view.fov.value;
    Tour.mouseEvents.startDistance = Tour.mouseEvents.getDistance(event)
    event.preventDefault();
};

Tour.mouseEvents.gesturechange = function(event) {
    function degToRad(deg) { return deg / 180 * Math.PI; }
    function radToDeg(rad) { return rad / Math.PI * 180; }

    var a = 1 / (Math.PI / Math.tan(degToRad(Tour.mouseEvents.startFov) / 2));
    Tour.view.fov.set(radToDeg(2 * Math.atan((a / event.scale) / 1 * Math.PI)));
    event.preventDefault();
};
