/* globals Tour*/

Tour.mouseEvents = {};

Tour.mouseEvents._setCinetic = function(event) {
    if (
        (event.clientX || event.clientY) &&
        (event.scale == undefined || event.scale == 1) &&
        (event.touches == undefined || event.touches.length == 1) &&
        !(this.previousEvent.clientX == event.clientX && this.previousEvent.clientY == event.clientY)
    ) {
        var alpha = Tour.view.fov.value / Tour.options.fov / Tour.options.mouseSensitivity;
        this.cineticLon = (event.clientX - this.previousEvent.clientX) * alpha;
        this.cineticLat = (event.clientY - this.previousEvent.clientY) * alpha;
    } else if (event.timeStamp - this.previousEvent.timeStamp > 20) {
        this.cineticLon = this.cineticLat = 0;
    }
    this.previousEvent = event;
};

Tour.mouseEvents._touches2mouse = function(event) {
    if (event.touches  && event.touches.length) {
        event.clientX = event.touches[0].pageX * window.devicePixelRatio;
        event.clientY = event.touches[0].pageY * window.devicePixelRatio;

        if (event.defaultPrevented) {
            event.preventDefault();
        }
    }
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
};

Tour.mouseEvents.down = function(event) {
    if (this.options.touchScroll && event.type == 'touchstart') {
        return false;
    }
    if (event.which == 2) {
        event.preventDefault();
        return false;
    }

    this.mouseEvents._touches2mouse(event);

    this.mouseEvents.drag = true;
    this.controls.autoRotate(false);
    this.mouseEvents.previousEvent = event;
};

Tour.mouseEvents.move = function(event) {
    if (this.mouseEvents.drag && (event.touches ? this.options.touchDrag : true)) {
        this.mouseEvents._touches2mouse(event);

        var alpha = Tour.view.fov.value / Tour.options.fov / Tour.options.mouseSensitivity;
        this.view.lon.set(this.view.lon.value + (event.clientX - this.mouseEvents.previousEvent.clientX) * alpha);
        this.view.lat.set(this.view.lat.value + (event.clientY - this.mouseEvents.previousEvent.clientY) * alpha);
        this.mouseEvents._setCinetic(event);
    }
};

Tour.mouseEvents.up = function(event) {
    if (this.mouseEvents.drag) {
        var alpha = Date.now() - this.mouseEvents.lastclick;
        if (this.mouseEvents.lastclick && alpha > 30 && alpha < 300) {
            this.controls.fullscreen();
        }
        this.mouseEvents.lastclick = Date.now();
        this.mouseEvents._touches2mouse(event);
        this.mouseEvents._setCinetic(event);

        this.view.rotation.lat = this.mouseEvents.cineticLat;
        this.view.rotation.lon = this.mouseEvents.cineticLon;

        this.history.set();
    }

    this.mouseEvents.cineticLon = this.mouseEvents.cineticLat = 0;
    this.mouseEvents.drag = false;
};

Tour.mouseEvents.gesturestart = function(event) {
    this.mouseEvents.startFov = Tour.view.fov.value;
    event.preventDefault();
};

Tour.mouseEvents.gesturechange = function(event) {
    function degToRad(deg) { return deg / 180 * Math.PI; }
    function radToDeg(rad) { return rad / Math.PI * 180; }

    var a = 1 / (Math.PI / Math.tan(degToRad(this.mouseEvents.startFov) / 2));
    Tour.view.fov.set(radToDeg(2 * Math.atan((a / event.scale) / 1 * Math.PI)));
    event.preventDefault();
};
