/* globals Tour*/

Tour.keyEvents = {};

Tour.keyEvents.down = function(event) {

    if ((event.ctrlKey || event.metaKey) && event.keyCode == 83) { // Ctrl+S, Cmd+S
        event.preventDefault();
        this.controls.download();
        return;
    }

    if ((event.shiftKey && event.metaKey && event.keyCode == 70) || event.keyCode == 122) { // ⌘⇧F, F11
        event.preventDefault();
        Tour.controls.fullscreen();
        return;
    }

    if ((event.keyCode == 82 && event.metaKey) || event.keyCode == 116) { // ⌘R, F5
        event.preventDefault();
        this.controls.reload();
        return;
    }

    switch (event.keyCode) {
        case 65: case 37:  this.controls.moveLeft(); break;        // A ←
        case 68: case 39:  this.controls.moveRight(); break;       // D →
        case 87: case 38:  this.controls.moveUp(); break;          // W ↑
        case 83: case 40:  this.controls.moveDown(); break;        // S ↓
        case 16: case 187: this.controls.zoomIn(); break;          // + Shift
        case 17: case 189: this.controls.zoomOut(); break;         // - Ctrl
        case 72: case 77:  this.controls.toggleMenu(); break;      // H M
        case 82: case 32:  this.controls.autoRotate(); break;      // R Space
        case 190:          this.controls.next(); break;            // >
        case 188:          this.controls.previous(); break;        // <
        case 112:          this.controls.help(event); break;       // F1
        case 113:          this.controls.editor(); break;          // F2
        case 27:           this.controls.closeWindow(); break;     // Esc
    }
};
