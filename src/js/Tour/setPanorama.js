/* globals Tour */

/**
 * Переключает тур на указанную панораму
 *
 * @param {Number} id идентификатор панорамы
 */
Tour.setPanorama = function(id, zoomin) {
	var pano = this.getPanorama(id);
    Tour.backgroundImage.transitionStart(function() {
        Tour.mesh.rotation.set(0, Math.PI / 2 - ((this.getPanorama(id).heading || 0) / 180 * Math.PI), 0);
        this.setTexture(id);
        this.setMarkers(id);
        this.setMesh(id);
        var view = {}
        if (pano.lon) view.lon = pano.lon;
        if (pano.lat) view.lat = pano.lat;
        this.view.set(view);
        var panorama = this.getPanorama(id);
        this.view.rotation.auto = panorama.autorotation !== false &&
            (panorama.autorotation || this.data.autorotation);
    }.bind(this), zoomin);
};
