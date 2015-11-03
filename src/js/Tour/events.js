/* globals Tour*/
Tour.events = {};

Tour.emmit = function(name, obj) {
    if (name in Tour.events) {
        Tour.events[name](obj);
    }
};

Tour.on = function(name, callback) {
    if (!(name in Tour.events)) {
        Tour.events[name] = [];
    }
    Tour.events[name] = callback;
};
