/* globals Tour*/

Tour.mouseEvents = {};

Tour.mouseEvents.wheel = function(event) {
    event.preventDefault();
    var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    if (delta > 0) {
        this.controls.zoomIn();
    } else {
        this.controls.zoomOut();
    }
};

Tour.mouseEvents.down = function(event) {
    Tour.mouseEvents.drag = true; //!! remove
    Tour.view.rotation.auto = false;
    Tour.mouseEvents.previousEvent = event;
};

Tour.mouseEvents.move = function(event) {
    if (Tour.mouseEvents.drag) {
        var alpha = 0.1 * Tour.view.fov.value / 75;

        Tour.view.lon.set(Tour.view.lon.value + (event.screenX - Tour.mouseEvents.previousEvent.screenX) * alpha);
        Tour.view.lat.set(Tour.view.lat.value + (event.screenY - Tour.mouseEvents.previousEvent.screenY) * alpha);
        Tour.mouseEvents.previousEvent = event;
    }
};

Tour.mouseEvents.up = function(event) {
    if (Tour.mouseEvents.drag) {
        var previousEvent = Tour.mouseEvents.previousEvent;
        Tour.view.rotation.lon = (event.screenX - previousEvent.screenX) * Tour.options.kineticRotateSpeed;
        Tour.view.rotation.lat = (event.screenY - previousEvent.screenY) * Tour.options.kineticRotateSpeed;
        Tour.history.set();
    }

    Tour.mouseEvents.drag = false;
};
