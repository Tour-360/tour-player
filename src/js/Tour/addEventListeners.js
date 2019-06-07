/* globals Tour*/

Tour.addEventListeners = function() {
    var active = { passive: false };

    this.renderer.domElement.addEventListener('dblclick',  Tour.controls.fullscreen.bind(this), active);
    this.renderer.domElement.addEventListener('mousedown', Tour.mouseEvents.down.bind(this), active);
    this.renderer.domElement.addEventListener('touchstart', Tour.mouseEvents.down.bind(this), active);
    this.renderer.domElement.addEventListener('mousewheel', Tour.mouseEvents.wheel.bind(this), active);
    this.renderer.domElement.addEventListener('wheel', Tour.mouseEvents.wheel.bind(this), active);

    this.renderer.domElement.addEventListener('gesturestart', Tour.mouseEvents.gesturestart.bind(this), active);
    this.renderer.domElement.addEventListener('gesturechange', Tour.mouseEvents.gesturechange.bind(this), active);

    document.addEventListener('mousemove', Tour.mouseEvents.move.bind(this), active);
    document.addEventListener('touchmove', Tour.mouseEvents.move.bind(this), active);
    document.addEventListener('mouseup', Tour.mouseEvents.up.bind(this), active);
    document.addEventListener('touchend', Tour.mouseEvents.up.bind(this), active);

    document.addEventListener('fullscreenchange', Tour.fullscreenEvents.change, active);
    document.addEventListener('webkitfullscreenchange', Tour.fullscreenEvents.change, active);
    document.addEventListener('mozfullscreenchange', Tour.fullscreenEvents.change, active);
    document.addEventListener('MSFullscreenChange', Tour.fullscreenEvents.change, active);

    window.addEventListener('keydown', Tour.keyEvents.down.bind(this));
    window.addEventListener('resize',  this.resize.bind(this), active);

    window.addEventListener('popstate', Tour.history.onpopstate);

    document.addEventListener('touchmove', function(event) {
        if (event.scale !== 1) {
            event.preventDefault();
        }
    }, active);

};
