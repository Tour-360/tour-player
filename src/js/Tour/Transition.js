/* globals Tour*/

Tour.Transition = function(value, options) {
    this.set(value);

    this.speed = 8;
    this.max = false;
    this.min = false;
    this.limit = false;

    this.setOptions(options);
};

Tour.Transition.prototype.setOptions = function(options) {
    for (var k in options) {
        this[k] = options[k];
    }
    this.value = this.moveTo(this.value);
};

Tour.Transition.prototype.set = function(value) {
    this.value = this.moveTo(value);
    Tour.emmit('moveView');
};

Tour.Transition.prototype.move = function(value, noanim) {
    if (value) {
        this.moveTo(this.follow + value, noanim);
    }
    return this.follow;
};

Tour.Transition.prototype.moveTo = function(value, noanim) {
    this.follow = Math.max(this.min || -Infinity, Math.min(this.max || Infinity, value));
    if (noanim) {
        this.value = this.follow;
    }
    return this.follow;
};

Tour.Transition.prototype.animate = function() {
    var alpha = (this.value - this.follow) / this.speed;
    if(Math.abs(alpha)>1e-5){
        this.value -= (this.value - this.follow) / this.speed;
        Tour.emmit('moveView');
    }else{
        this.value = this.follow;
    }
};

Tour.Transition.prototype.toString = function() {
    return parseFloat((this.limit ? this.follow % this.limit : this.follow).toFixed(2));
};
