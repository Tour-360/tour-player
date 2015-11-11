/* globals Tour */

Tour.options = {};

Tour.setOption = function(options) {
    if (typeof option === 'object') {
        for (var k in options) {
            Tour.options[k] = options[k];
        }
    }
};
