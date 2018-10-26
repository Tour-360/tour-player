/* globals Tour, Lang */

Tour.history = {};

/**
 * Перезаписывает последнюю запись в историю
 *
 * @param {Boolean} push если указанно true, то создается новая запись
 */
Tour.history.set = function(push) {
    var title = [Lang.translate(Tour.data.title) || Lang.get('virtual-tour'),
    Lang.translate(Tour.getPanorama(Tour.view.id).title)];

    title = title.join(title[1] ? ' – ' : '');

    window.history[(push ? 'pushState' : 'replaceState')](
        Tour.view.get(), title, Tour.query.set(Tour.view) + window.location.hash
    );
    document.title = title;
    Tour.controls.autoRotate(true);
};

Tour.history.onpopstate = function(event) {
    Tour.view.set(event.state, true);
};
