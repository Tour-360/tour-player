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

        Tour.view.lon.set(Tour.view.lon.value - (event.screenX - Tour.mouseEvents.previousEvent.screenX) * alpha);
        Tour.view.lat.set(Tour.view.lat.value + (event.screenY - Tour.mouseEvents.previousEvent.screenY) * alpha);
        Tour.mouseEvents.previousEvent = event;
    }
};

Tour.mouseEvents.up = function(event) {
    Tour.mouseEvents.drag = false;

    Tour.view.rotation.lon = Math.max(-20, Math.min(20, (Tour.mouseEvents.previousEvent.screenX - event.screenX) / 10));
    Tour.view.rotation.lat = Math.max(-20, Math.min(20, (event.screenY - Tour.mouseEvents.previousEvent.screenY) / 10));

    Tour.history.set();
};
