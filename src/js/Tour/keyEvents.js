/* globals Tour*/

Tour.keyEvents = {};

Tour.keyEvents.down = function(event) {
    switch (event.keyCode) {
        case 65: case 37:  this.controls.moveLeft(); break;        // A ←
        case 68: case 39:  this.controls.moveRight(); break;       // D →
        case 87: case 38:  this.controls.moveUp(); break;          // W ↑
        case 83: case 40:  this.controls.moveDown(); break;        // S ↓
        case 16: case 187: this.controls.zoomin(); break;          // + Shift
        case 17: case 189: this.controls.zoomout(); break;         // - Ctrl
        case 72: case 77:  this.controls.hideMenu(); break;        // H M
        case 82: case 32:  this.controls.autoRotation(); break;    // R Space
        case 112:          this.controls.help(event); break;       // F1
        case 113:          this.controls.editor(); break;          // F2
        case 27:           this.controls.closeWindow(); break;     // Esc
    }
};
