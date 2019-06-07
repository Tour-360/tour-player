/* globals Tour*/

/**
 * Параметры посмотра
 * поворот камеры, угол обзора, id текущей панорамы
 * @type {Object}
 */
Tour.view = {};

Tour.view.set = function(options, replaceHistory, zoom) {

    options = options || {};

    this.fov = new Tour.Transition(options.fov || this.fov || Tour.options.fov, Tour.options.limit.fov);
    this.lat = new Tour.Transition(options.lat || this.lat || 0, Tour.options.limit.lat);
    this.lon = new Tour.Transition(options.lon || this.lon || 0, Tour.options.limit.lon);

    this.lon.limit = 360;

    this.rotation = {lon: 0, lat: 0, auto: false};
    Object.defineProperty(this, 'rotation', {enumerable: false});

    if (this.id != options.id && options.id !== undefined) {
        this.id = options.id;
        Tour.setPanorama(this.id, zoom);
    }
    Tour.history.set(!replaceHistory);

    var panorama;
    for (var k in this) {
        if (k != 'id') {
            panorama = Tour.getPanorama(this.id);
            this[k].setOptions(
                (panorama && panorama.limit && panorama.limit[k]) ||
                (Tour.data.limit && Tour.data.limit[k]) ||
                Tour.options.limit[k]
            );
        }
    }
    Tour.emmit('changeView', Tour.view.get());
};

Tour.view.go = function(step) {
    var index = Tour.data.panorams.indexOf(Tour.getPanorama(Tour.view.id));
    index += step;
    index = index % Tour.data.panorams.length;

    if (index < 0) {
        index = Tour.data.panorams.length + index;
    }

    Tour.view.set({id: index});
};

Tour.view.get = function() {
    var view = {};
    for (var k in this) {
        view[k] = typeof this[k] == 'object' ? this[k].follow : this[k];
    }
    return JSON.parse(JSON.stringify(view));
};

Object.defineProperty(Tour.view, 'set', {enumerable: false});
Object.defineProperty(Tour.view, 'get', {enumerable: false});
Object.defineProperty(Tour.view, 'go', {enumerable: false});
