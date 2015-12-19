/* globals Tour*/

/**
 * Параметры посмотра
 * поворот камеры, угол обзора, id текущей панорамы
 * @type {Object}
 */
Tour.view = {};

Tour.view.set = function(options) {
    options = options || {};
    this.fov = new Tour.Transition(options.fov || 75, Tour.options.limit.fov);
    this.lat = new Tour.Transition(options.lat || 0,  Tour.options.limit.lat);
    this.lon = new Tour.Transition(options.lon || 0,  Tour.options.limit.lon);
    this.id = 0;

    this.rotation = {lon: 0, lat: 0, auto: false};
    Object.defineProperty(this, 'rotation', {enumerable: false});
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
