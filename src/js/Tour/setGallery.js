/* globals UI, Tour, Lang */
Tour.setGallery = function(data, visible) {
    if (this.options.gallery) {
        UI.gallery.init(visible);


        data.panorams.map(function(pano){
            if (pano.listNumber !== 0) {
                UI.gallery.addItem({
                    id: pano.id,
                    image: 'panorams/'+pano.id+'/thumbnail/mini.jpg',
                    title: Lang.translate(pano.title),
                    onclick: function(){
                        Tour.view.set(pano);
                    }
                });
            }
        });

        UI.gallery.setActive(Tour.view.id);

        Tour.on('changeView', function(view){
            UI.gallery.setActive(view.id)
        })
    }
};
