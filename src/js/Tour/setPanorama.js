/* globals Tour */

/**
 * Переключает тур на указанную панораму
 *
 * @param {Number} id идентификатор панорамы
 */
Tour.setPanorama = function(id) {
    this.view.id = id || 0;
    this.setTexture(this.view.id);
    Tour.history.set(true);
};
