/* globals Tour, Lang, BrouserInfo*/

Tour.init = function(data, options) {
    console.info('Tour-player', 'v' + Tour.version.join('.'), 'by http://Tour-360.ru');
    Lang.set();
    BrouserInfo();
    Tour.query.get();
    Tour.setOption(options);
    Tour.setOption(Tour.queries);
    Tour.createScene();
    Tour.load(Tour.options.data || data);
};
