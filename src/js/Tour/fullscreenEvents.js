/* globals Tour*/

Tour.fullscreenEvents = {};

Tour.fullscreenEvents.change = function() {

    var fullscreen =
    document.fullscreen ||
    document.mozFullScreen ||
    document.webkitIsFullScreen ||
    document.msFullscreenElement;

    Tour.domElement.classList[fullscreen ? 'add' : 'remove']('fullscreen');
};
