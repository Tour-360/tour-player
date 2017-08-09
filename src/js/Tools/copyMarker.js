/* globals Tools */

Tools.copyMarker = function(id, lat) {
    console.info('Pano id:', Tour.view.id)
    var code = JSON.stringify({
        lat: lat || parseFloat(Tour.view.lat.value.toFixed(2)),
        lon: parseFloat(Tour.view.lon.value.toFixed(2)),
        action:{type:'panorama', id:id}
    }, null, "");

    Tour.controls.copyText(code);
};
