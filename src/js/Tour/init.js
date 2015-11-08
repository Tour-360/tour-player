/* globals Tour, Lang*/

Tour.init = function(data) {
    console.info('Tour-player', 'v' + Tour.version.join('.'), 'by http://Tour-360.ru');
    Lang.setLanguage();
    Tour.query.get();
    Tour.load(Tour.queries.data || data);
};
