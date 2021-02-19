/* globals Tour */

/**
 * Переключает тур на указанную панораму
 *
 * @param {Number} id идентификатор панорамы
 */
Tour.setPanorama = function(id, zoomin, callback) {
    Tour.backgroundImage.transitionStart(function() {
        Tour.mesh.rotation.set(0, Math.PI / 2 - ((this.getPanorama(id).heading || 0) / 180 * Math.PI), 0);
        Tour.areasManager.areas.rotation = Tour.mesh.rotation.y;
        this.setTexture(id);
        this.setMarkers(id);
        this.stopMedia();
        this.pointsManager.set();
        this.nadirControl.set();
        this.areasManager.set();
        var panorama = this.getPanorama(id);
        this.view.rotation.auto = panorama.autorotation !== false &&
            (panorama.autorotation || this.data.autorotation);
        callback && callback();
    }.bind(this), zoomin);
};
