/* globals Tour*/

Tour.mouseEvents = {};

Tour.mouseEvents.wheel = function(event) {
    event.preventDefault();
    var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    if (delta > 0) {
        this.controls.zoomin();
    } else {
        this.controls.zoomout();
    }
};

Tour.mouseEvents.down = function() {
    Tour.mouseEvents.drag = true; //!! remove
};

Tour.mouseEvents.move = function(event) {
    if (Tour.mouseEvents.drag) {
        var alpha = 0.1 * Tour.view.fov.value / 75;

        Tour.view.lon.set(Tour.view.lon.value - event.movementX * alpha);
        Tour.view.lat.set(Tour.view.lat.value + event.movementY * alpha);
    }
};

Tour.mouseEvents.up = function() {
    Tour.mouseEvents.drag = false;
    Tour.history.set();
};
