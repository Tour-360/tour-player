/* globals Tour*/

Tour.fullscreenEvents = {};

Tour.fullscreenEvents.change = function() {

    var fullscreen =
    document.fullscreen ||
    document.mozFullScreen ||
    document.webkitIsFullScreen ||
    document.msFullscreenElement;

    document.body.classList[fullscreen ? 'add' : 'remove']('fullscreen');
};
