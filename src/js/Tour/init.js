/* globals Tour, Lang, BrouserInfo, UI*/

Tour.init = function(domElement, options) {
    // this.sentry();
    console.info('Tour-player', 'v' + this.version.join('.'), 'by http://Tour-360.ru');
    BrouserInfo();
    this.options.set(this.defaultOption);
    options.domElement = domElement;
    this.options.set(options);
    this.options.set(Tour.query.get());
    this.domElement = document.querySelector(this.options.domElement);
    Lang.set(this.options.lang, Tour.dictionary);
    this.plugins.init();
    this.backgroundImage.init();
    this.createScene();
    this.mousManager.init();
    this.nadirControl.init();
    this.pointsManager.init();
    this.areasManager.init();
    UI.notification.init();
    UI.tooltip.init();
    UI.popUp.init();
    this.setSliders();
    this.options.cursor && UI.devCursor.init();
    this.setControlPanel();
    this.setMouseMenu();
    this.orientationControls.init();
    this.load(this.options.manifest, function(data) {
        this.setMedia(data.media);
        document.title = Lang.translate(data.title) || Lang.get('virtual-tour');
        var query = Tour.query.get();
        query.id = query.id || data.start || data.panorams[0].id || 0;
        if (query.id == data.start && !query.lon && !query.lat) {
            var pano = this.getPanorama(query.id);
            query.lat = pano.lat;
            query.lon = pano.lon;
        }
        this.view.set(query, true);
        this.setGallery(data, this.options.galleryVisible);
        this.addEventListeners();
        Tour.emmit('init');
        this.animate();
    }.bind(this));
};
