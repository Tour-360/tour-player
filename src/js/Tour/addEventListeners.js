/* globals Tour*/

Tour.addEventListeners = function() {
    document.addEventListener('dblclick',  Tour.controls.fullscreen.bind(this), false);
    document.addEventListener('mousedown', Tour.mouseEvents.down.bind(this),    false);
    document.addEventListener('mousemove', Tour.mouseEvents.move.bind(this),    false);
    document.addEventListener('mouseup',   Tour.mouseEvents.up.bind(this),      false);
    document.addEventListener('mousewheel', Tour.mouseEvents.wheel.bind(this),  false);

    window.addEventListener('keydown', Tour.keyEvents.down.bind(this), false);
    window.addEventListener('resize',  this.resize.bind(this), false);
};
