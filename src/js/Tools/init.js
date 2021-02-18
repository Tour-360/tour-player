/* globals Tools */

Tools.init = function() {
    if(!this.active){
        Tools.mapEditor.init();
        // window.addEventListener('keydown', function(event) {
        //     switch (event.code) {
        //         case 'Digit1':  Tools.copyLon(); break;
        //         case 'Digit2':  Tools.markerEditor.init(); break;
        //         case 'Digit4':  Tools.meshEditor(); break;
        //         case 'Digit6':  Tools.mapEditor.init(); break;
        //     }
        // });

        // new UI.mouseMenu.Hr();
        // new UI.mouseMenu.Item(Tools.copyLon, 'Copy lon', '1');
        // new UI.mouseMenu.Item(Tools.markerEditor.init.bind(Tools.markerEditor), 'Marker editor', '2');
        // new UI.mouseMenu.Item(Tools.meshEditor, 'Mesh editor', '4');
        // new UI.mouseMenu.Item(Tools.mapEditor.init, 'Map editor', '6');

        this.active = true;
        UI.notification.show('You are in edit mode');
    }else{
        UI.notification.show('You are already in edit mode');
    }

};

Tools.copyLon = function() {
    Tour.controls.copyText(parseFloat(Tour.view.get().lon.toFixed(2)));
};
