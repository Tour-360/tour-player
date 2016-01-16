/* globals Tour*/

Tour.addEventListeners = function() {
    this.renderer.domElement.addEventListener('dblclick',  Tour.controls.fullscreen.bind(this), false);
    this.renderer.domElement.addEventListener('mousedown', Tour.mouseEvents.down.bind(this),    false);
    this.renderer.domElement.addEventListener('mousemove', Tour.mouseEvents.move.bind(this),    false);
    this.renderer.domElement.addEventListener('mousewheel', Tour.mouseEvents.wheel.bind(this),  false);
    document.addEventListener('mouseup', Tour.mouseEvents.up.bind(this), false);

    document.addEventListener('fullscreenchange', Tour.fullscreenEvents.change);
    document.addEventListener('webkitfullscreenchange', Tour.fullscreenEvents.change);
    document.addEventListener('mozfullscreenchange', Tour.fullscreenEvents.change);
    document.addEventListener('MSFullscreenChange', Tour.fullscreenEvents.change);

    window.addEventListener('keydown', Tour.keyEvents.down.bind(this), false);
    window.addEventListener('resize',  this.resize.bind(this), false);

    window.addEventListener('popstate', Tour.history.onpopstate, false);
};
