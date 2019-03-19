/* globals Tour*/

Tour.addEventListeners = function() {
    var passive = {passive:true};
    this.renderer.domElement.addEventListener('dblclick',  Tour.controls.fullscreen.bind(this), passive);
    this.renderer.domElement.addEventListener('mousedown', Tour.mouseEvents.down.bind(this), passive);
    this.renderer.domElement.addEventListener('touchstart', Tour.mouseEvents.down.bind(this), passive);
    this.renderer.domElement.addEventListener('mousewheel', Tour.mouseEvents.wheel.bind(this));
    this.renderer.domElement.addEventListener('wheel', Tour.mouseEvents.wheel.bind(this));
    document.addEventListener('mousemove', Tour.mouseEvents.move.bind(this), passive);
    document.addEventListener('touchmove', Tour.mouseEvents.move.bind(this), passive);
    document.addEventListener('mouseup', Tour.mouseEvents.up.bind(this), passive);
    document.addEventListener('touchend', Tour.mouseEvents.up.bind(this), passive);

    document.addEventListener('fullscreenchange', Tour.fullscreenEvents.change);
    document.addEventListener('webkitfullscreenchange', Tour.fullscreenEvents.change);
    document.addEventListener('mozfullscreenchange', Tour.fullscreenEvents.change);
    document.addEventListener('MSFullscreenChange', Tour.fullscreenEvents.change);

    window.addEventListener('keydown', Tour.keyEvents.down.bind(this));
    window.addEventListener('resize',  this.resize.bind(this));

    window.addEventListener('popstate', Tour.history.onpopstate);
};
