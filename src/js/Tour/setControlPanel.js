/* globals UI, Tour, Lang */

Tour.setControlPanel = function() {
    if (this.options.controlPanel !== undefined) {
        UI.controlPanel.init(this.options.controlPanel);
        UI.controlPanel.addBtn('left',       Tour.controls.moveLeft,   Lang.get('control.left'));
        UI.controlPanel.addBtn('right',      Tour.controls.moveRight,  Lang.get('control.right'));
        UI.controlPanel.addBtn('up',         Tour.controls.moveUp,     Lang.get('control.up'));
        UI.controlPanel.addBtn('down',       Tour.controls.moveDown,   Lang.get('control.down'));
        UI.controlPanel.addBtn('zoom-in',    Tour.controls.zoomIn,     Lang.get('mousemenu.zoomin'));
        UI.controlPanel.addBtn('zoom-out',   Tour.controls.zoomOut,    Lang.get('mousemenu.zoomout'));
        UI.controlPanel.addBtn('fullscreen', Tour.controls.fullscreen, Lang.get('mousemenu.fullscreen'));
    }
};
