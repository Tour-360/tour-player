/* globals Tour, Lang */

Tour.history = {};

/**
 * Перезаписывает последнюю запись в историю
 *
 * @param {Boolean} replace если указанно true, то создается новая запись
 */
Tour.history.set = function(replace) {
    var method = replace ? window.history.replaceState : window.history.pushState;
    document.title = Tour.data.panorams[Tour.view.id].title || this.data.title || Lang.get('virtual_tour');
    method(Tour.getView(), document.title, Tour.query.set(Tour.view));
};
