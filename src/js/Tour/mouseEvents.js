/* globals Tour*/

Tour.mouseEvents = {};

Tour.mouseEvents._setCinetic = function(event) {
    if (event.clientX || event.clientY) {
        var alpha = Tour.view.fov.value / 750;
        this.cineticLon = (event.clientX - this.previousEvent.clientX) * alpha;
        this.cineticLat = (event.clientY - this.previousEvent.clientY) * alpha;
    } else if (event.timeStamp - this.previousEvent.timeStamp > 20) {
        this.cineticLon = this.cineticLat = 0;
    }
    this.previousEvent = event;
};

Tour.mouseEvents._touches2mouse = function(event) {
    if (event.touches && event.touches.length) {
        event.clientX = event.touches[0].pageX * window.devicePixelRatio;
        event.clientY = event.touches[0].pageY * window.devicePixelRatio;
        event.preventDefault();
    }
};

Tour.mouseEvents.wheel = function(event) {
    if (this.options.scaleControl) {
        event.preventDefault();
        this.view.fov.move(event.deltaY * (event.deltaMode ? 10 / 3 : 0.1));

        /* Задржка на изменение истории при скроле на MacOS */
        clearInterval(this.mouseEvents.timeout);
        this.mouseEvents.timeout = setTimeout(function() {
            Tour.history.set();
        }, 300);
    }
};

Tour.mouseEvents.down = function(event) {
    if (event.which == 2) {
        event.preventDefault();
        return false;
    }

    this.mouseEvents._touches2mouse(event);

    this.mouseEvents.drag = true;
    this.view.rotation.auto = false;
    this.mouseEvents.previousEvent = event;
};

Tour.mouseEvents.move = function(event) {
    if (this.mouseEvents.drag && (event.touches ? this.options.mobileDrag : true)) {
        this.mouseEvents._touches2mouse(event);

        var alpha = this.view.fov.value / 750;
        this.view.lon.set(this.view.lon.value + (event.clientX - this.mouseEvents.previousEvent.clientX) * alpha);
        this.view.lat.set(this.view.lat.value + (event.clientY - this.mouseEvents.previousEvent.clientY) * alpha);
        this.mouseEvents._setCinetic(event);
    }
};

Tour.mouseEvents.up = function() {
    if (this.mouseEvents.drag) {
        this.mouseEvents._touches2mouse(event);
        this.mouseEvents._setCinetic(event);

        this.view.rotation.lat = this.mouseEvents.cineticLat;
        this.view.rotation.lon = this.mouseEvents.cineticLon;

        this.history.set();
    }

    this.mouseEvents.drag = false;
};
