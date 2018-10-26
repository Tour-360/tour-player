/* globals Tour */

/**
 * Простая утилита для получения конкретной панорамы из масива
 */
Tour.getPanorama = function(key) {
    return (Tour.data.panorams || []).filter(function(pano) {
        return pano.id == (key || 0);
    })[0] || Tour.data.panorams[0];
};
