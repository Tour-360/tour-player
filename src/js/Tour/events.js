/* globals Tour*/
Tour.events = {};

Tour.emmit = function(name, obj) {
    if (name in this.events) {
        this.events[name].forEach(function(event) {
            event.call(this, obj);
        }.bind(this));
    }
};

Tour.on = function(name, callback) {
    if (!(name in this.events)) {
        this.events[name] = [];
    }
    this.events[name].push(callback);
};
