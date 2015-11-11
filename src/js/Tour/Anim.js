/* globals Tour*/

Tour.Anim = function(value, speed) {
    this.set(value);
    this.speed = speed || 8;
    this.max = false;
    this.min = false;
};

Tour.Anim.prototype.set = function(value) {
    this.value = this.move = value;
};

Tour.Anim.prototype.animate = function() {
    if (this.max !== false && this.move > this.max) {this.move = this.max;}
    if (this.min !== false && this.move < this.min) {this.move = this.min;}
    this.value -= (this.value - this.move) / this.speed;
};
