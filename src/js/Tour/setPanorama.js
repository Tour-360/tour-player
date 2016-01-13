/* globals Tour */

/**
 * Переключает тур на указанную панораму
 *
 * @param {Number} id идентификатор панорамы
 */
Tour.setPanorama = function(id) {
    if (this.view.id != id) {
        this.view.id = id || 0;
        this.setTexture(this.view.id);
        this.setMarkers();
        this.history.set(true);
    }
};
