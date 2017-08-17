/* globals Tour, Lang, BrouserInfo, UI*/

Tour.init = function(data, options) {
    console.info('Tour-player', 'v' + this.version.join('.'), 'by http://Tour-360.ru');
    BrouserInfo();
    this.options.set(this.defaultOption);
    this.options.set(options);
    Lang.set(this.options.lang, Tour.dictionary);
    this.backgroundImage.init();
    this.createScene();
    UI.notification.init();
    UI.popUp.init();
    UI.gallery.init();
    this.setControlPanel();
    this.setMouseMenu();
    this.orientationControls.init();
    this.load(data, function(data) {

        for(var i=0; i<data.panorams.length; i++){
            var pano = data.panorams[i];
            UI.gallery.addItem({
                image: 'panorams/'+pano.id+'/thumbnail/mini.jpg',
                title: Lang.translate(data.panorams[i].title),
                onclick: function(pano){
                    this.view.set({id:pano.id})
                }.bind(this, pano)
            })
        }


        document.title = Lang.translate(data.title) || Lang.get('virtual-tour');
        var query = Tour.query.get();
        query.id = query.id || data.start || 0;
        this.view.set(query, true);
        this.addEventListeners();
        this.animate();
    }.bind(this));
};
