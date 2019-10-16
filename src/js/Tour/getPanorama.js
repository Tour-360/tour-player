/* globals Tour */

/**
 * Простая утилита для получения конкретной панорамы из масива
 */
Tour.getPanorama = function(key) {
    var key = key !== undefined ? key : this.view.id;
    return (this.data.panorams || []).filter(function(pano) {
        return pano.id == (key || 0);
    })[0] || this.data.panorams[0];
};
