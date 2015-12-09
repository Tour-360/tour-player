/* globals Tour */

Tour.options = {};

Tour.options.set = function(options) {
    if (typeof options === 'object') {
        for (var k in options) {
            this[k] = options[k];
        }
    }
};

Object.defineProperty(Tour.options, 'set', {enumerable: false});
