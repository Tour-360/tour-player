/* globals Tour, Lang */

Tour.history = {};

/**
 * Перезаписывает последнюю запись в историю
 *
 * @param {Boolean} push если указанно true, то создается новая запись
 */
Tour.history.set = function(push) {
    var title = Lang.translate(
        Tour.data.panorams[Tour.view.id || 0].title || Tour.data.title || Lang.get('virtual-tour')
    );

    window.history[(push ? 'pushState' : 'replaceState')](Tour.view.get(), title, Tour.query.set(Tour.view));
    document.title = title;
};

Tour.history.onpopstate = function(event) {
    Tour.view.set(event.state, true);
};
