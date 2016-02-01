/* globals Tour*/

Tour.mouseEvents = {};

Tour.mouseEvents.wheel = function(event) {
    if (Tour.options.scaleControl) {
        event.preventDefault();
        Tour.view.fov.move(event.deltaY * (event.deltaMode ? 10 / 3 : 0.1));

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
    Tour.mouseEvents.drag = true; //!! remove
    Tour.view.rotation.auto = false;
    Tour.mouseEvents.previousEvent = event;
};

Tour.mouseEvents.move = function(event) {
    if (Tour.mouseEvents.drag) {
        var alpha = 0.1 * Tour.view.fov.value / 75;

        Tour.view.lon.set(Tour.view.lon.value + (event.clientX - Tour.mouseEvents.previousEvent.clientX) * alpha);
        Tour.view.lat.set(Tour.view.lat.value + (event.clientY - Tour.mouseEvents.previousEvent.clientY) * alpha);
        Tour.mouseEvents.previousEvent = event;
    }
};

Tour.mouseEvents.up = function(event) {
    if (Tour.mouseEvents.drag) {
        var previousEvent = Tour.mouseEvents.previousEvent;
        Tour.view.rotation.lon = (event.clientX - previousEvent.clientX) * Tour.options.kineticRotateSpeed;
        Tour.view.rotation.lat = (event.clientY - previousEvent.clientY) * Tour.options.kineticRotateSpeed;
        Tour.history.set();
    }

    Tour.mouseEvents.drag = false;
};
