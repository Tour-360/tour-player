/* globals Tools */

Tools.markerEditor = {}

Tools.markerEditor.init = function() {
    this.setPoint();
    window.addEventListener('keydown', function(event) {
        if(event.keyCode == 13) this.copyMarker();
    }.bind(this));
}

Tools.markerEditor.copyInfoMarker = function(title, id) {
    console.info('Pano id:', Tour.view.id);

    var marker = {
        lat: parseFloat(Tour.view.lat.value.toFixed(2)),
        lon: parseFloat(Tour.view.lon.value.toFixed(2))
    };

    if (title) {
        marker.title = title;
    }
    if (id) {
        marker.action = { type: 'popup', id: id };
    }

    var code = JSON.stringify(marker, null, '');

    Tour.controls.copyText(code);
};


Tools.markerEditor.copyMarker = function() {
    if (Tools.markerEditor.point.icon == 'info') {
        this.copyInfoMarker(
            prompt('Enter title for info marker', 'title'),
            prompt('Enter popup id', '')
        );
    } else {
        this.copyDirectionMarker(prompt('Enter pano id', Tour.view.id));
    }
};

Tools.markerEditor.copyDirectionMarker = function(id, lat) {
    console.info('Pano id:', Tour.view.id);
    var code = JSON.stringify({
        lat: lat || parseFloat(Tour.view.lat.value.toFixed(2)),
        lon: parseFloat(Tour.view.lon.value.toFixed(2)),
        icon: Tools.markerEditor.point.icon,
        action: { type: 'panorama', id: id }
    }, null, '');

    Tour.controls.copyText(code);
};


Tools.markerEditor.setPoint = function() {
    var directions = ['up', 'right', 'down', 'left', 'point', 'info'];
    var currentDirection = -1;

    var onclick = function() {
        Tools.markerEditor.point = {icon: directions[++currentDirection % directions.length]};
        point.setIcon(Tools.markerEditor.point.icon);
    };

    var point = new UI.Marker(onclick, false, false);
    point.setVisible(true);

    Object.assign(point.domElement.style, {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto'
    });

    onclick();
};
