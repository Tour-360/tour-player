/* globals Tour, Lang, UI, BrouserInfo */

Tour.setMouseMenu = function() {
    if (this.options.mouseMenu) {
        UI.mouseMenu.init();

        var itemList = [];
        var metaKey = BrouserInfo.apple ? '⌘' : 'Alt';
        var info = 'Tour-Player v' + Tour.version.join('.') + ' (' +
        {webgl: 'WebGL', css: 'CSS', canvas: 'Canvas'}[this.options.rendererType] + 'Renderer)';

        itemList.push(new UI.mouseMenu.Item(this.controls.back, Lang.get('mousemenu.back'),
            metaKey + '+' + Lang.get('key.left')));
        itemList.push(new UI.mouseMenu.Item(this.controls.forward, Lang.get('mousemenu.forward'),
            metaKey + '+' + Lang.get('key.right')));
        itemList.push(new UI.mouseMenu.Item(this.controls.reload, Lang.get('mousemenu.reload'), 'Ctrl+R'));

        itemList.push(new UI.mouseMenu.Hr());
        itemList.push(new UI.mouseMenu.Item(this.controls.zoomIn, Lang.get('mousemenu.zoomin'), 'Shift, +'));
        itemList.push(new UI.mouseMenu.Item(this.controls.zoomOut, Lang.get('mousemenu.zoomout'), 'Ctrl, -'));
        itemList.push(new UI.mouseMenu.Item(this.controls.autoRotate, Lang.get('mousemenu.autorotate'),
            'R, ' + Lang.get('key.spase')));
        itemList.push(new UI.mouseMenu.Item(this.controls.fullscreen, Lang.get('mousemenu.fullscreen'), 'F11'));

        if (this.options.rendererType != 'css') {
            itemList.push(new UI.mouseMenu.Hr());
            itemList.push(new UI.mouseMenu.Item(this.controls.download, Lang.get('mousemenu.saveimage'),
                metaKey + '+S'));
        }

        itemList.push(new UI.mouseMenu.Hr());
        itemList.push(new UI.mouseMenu.Item(this.controls.hideMenu, Lang.get('mousemenu.hidemenu'), 'M'));
        itemList.push(new UI.mouseMenu.Item(this.controls.getCode, Lang.get('mousemenu.getcode')));
        itemList.push(new UI.mouseMenu.Item(this.controls.opennewtab, Lang.get('mousemenu.newtab')));
        itemList.push(new UI.mouseMenu.Item(this.controls.visitSite, Lang.get('mousemenu.visitsite') +
            ' tour-360.ru'));

        itemList.push(new UI.mouseMenu.Hr());
        itemList.push(new UI.mouseMenu.Item(false, info));
        itemList[itemList.length - 1].setDisable(true);
    } else if (this.options.mouseMenu !== undefined) {
        document.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        });
    }
};
