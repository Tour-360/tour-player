/* globals Tour, Lang */

Tour.history = {};

/**
 * Перезаписывает последнюю запись в историю
 *
 * @param {Boolean} push если указанно true, то создается новая запись
 */
Tour.history.set = function(push) {
    document.title = Tour.data.panorams[Tour.view.id].title || Tour.data.title || Lang.get('virtual-tour');

    window.history[(push ? 'pushState' : 'replaceState')](Tour.view.get(), document.title, Tour.query.set(Tour.view));
};
