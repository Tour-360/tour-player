/* globals Tour */

/**
 * Переключает тур на указанную панораму
 *
 * @param {Number} id идентификатор панорамы
 */
Tour.setPanorama = function(id, zoomin) {
    Tour.backgroundImage.transitionStart(function() {
        Tour.mesh.rotation.set(0, Math.PI / 2 - ((this.getPanorama(id).heading || 0) / 180 * Math.PI), 0);
        this.setTexture(id);
        this.setMarkers(id);
        this.setMesh(id);
        this.nadirControl.set();
        this.pointsManager.set();
        this.areasManager.set();
        var panorama = this.getPanorama(id);
        this.view.rotation.auto = panorama.autorotation !== false &&
            (panorama.autorotation || this.data.autorotation);
    }.bind(this), zoomin);
};
