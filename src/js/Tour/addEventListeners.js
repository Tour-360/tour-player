/* globals Tour*/

Tour.addEventListeners = function() {
    this.renderer.domElement.addEventListener('dblclick',  Tour.controls.fullscreen.bind(this));
    this.renderer.domElement.addEventListener('mousedown', Tour.mouseEvents.down.bind(this));
    this.renderer.domElement.addEventListener('mousewheel', Tour.mouseEvents.wheel.bind(this));
    document.addEventListener('mousemove', Tour.mouseEvents.move.bind(this));
    document.addEventListener('mouseup', Tour.mouseEvents.up.bind(this));

    document.addEventListener('fullscreenchange', Tour.fullscreenEvents.change);
    document.addEventListener('webkitfullscreenchange', Tour.fullscreenEvents.change);
    document.addEventListener('mozfullscreenchange', Tour.fullscreenEvents.change);
    document.addEventListener('MSFullscreenChange', Tour.fullscreenEvents.change);

    window.addEventListener('keydown', Tour.keyEvents.down.bind(this));
    window.addEventListener('resize',  this.resize.bind(this));

    window.addEventListener('popstate', Tour.history.onpopstate);
    window.addEventListener('error', Tour.report);
};
