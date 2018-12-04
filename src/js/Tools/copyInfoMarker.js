/* globals Tools */

Tools.copyInfoMarker = function(title, id) {
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
