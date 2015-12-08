/* globals Tour */

Tour.options = {};

Tour.setOption = function(options) {
    if (typeof options === 'object') {
        for (var k in options) {
            Tour.options[k] = options[k];
        }
    }
};
