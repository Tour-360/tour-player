/* globals Tools */

Tools.init = function() {
    this.setPoint();
    window.addEventListener('keydown', function(event) {
        if (event.keyCode == 13) { //Enter
            Tools.copyMarker();
        }

        switch (event.keyCode) {
            case 13:  Tools.copyMarker(); break;  // Enter
            case 49:  Tools.copyLon(); break;     // 1
            case 50:  Tools.meshEditor(); break;  // 2
        }
    });

    new UI.mouseMenu.Hr();
    new UI.mouseMenu.Item(Tools.copyLon, 'Copy lon', '1');
    new UI.mouseMenu.Item(Tools.meshEditor, 'Mesh editor', '2');

    this.meshEditor();

    Tour.view.fov.min = 5;
    Tour.view.fov.max = 130;
};

Tools.copyLon = function() {
    Tour.controls.copyText(parseFloat(Tour.view.get().lon.toFixed(2)));
};
