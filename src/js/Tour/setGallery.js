/* globals UI, Tour, Lang */

Tour.setGallery = function(data) {
    if (this.options.gallery) {
    	UI.gallery.init();


        var panorams = data.panorams.map(function(n){
            if (n.listNumber === undefined) n.listNumber = Infinity;
        }).sort(function(a, b){
            return a.listNumber > b.listNumber && a.listNumber
        })

    	for(var i=0; i<panorams.length; i++){
            var pano = data.panorams[i];
            if(pano.listNumber !== 0){
                UI.gallery.addItem({
                    id: pano.id,
                    image: 'panorams/'+pano.id+'/thumbnail/mini.jpg',
                    title: Lang.translate(data.panorams[i].title),
                    onclick: function(pano){
                        this.view.set({id:pano.id})
                    }.bind(this, pano)
                })
            }
        }

        Tour.on('changeView', function(view){
            UI.gallery.setActive(view.id)
        })
    }
};
