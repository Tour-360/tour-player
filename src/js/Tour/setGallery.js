/* globals UI, Tour, Lang */
Tour.setGallery = function(data) {
    if (this.options.gallery) {
    	UI.gallery.init();

        var panorams = data.panorams.map(function(n){
            n.listNumber = n.listNumber===undefined ? Infinity : n.listNumber;
            return n;
        }).sort(function(a, b){
            return a.listNumber - b.listNumber || a.id - b.id;
        })

    	for(var i=0; i<panorams.length; i++){
            var pano = panorams[i];
            if(pano.listNumber !== 0){
                UI.gallery.addItem({
                    id: pano.id,
                    image: 'panorams/'+pano.id+'/thumbnail/mini.jpg',
                    title: Lang.translate(panorams[i].title),
                    onclick: function(pano){
                        this.view.set({
                            id: pano.id,
                            lat: data.panorams[pano.id].lat || 0,
                            lon: data.panorams[pano.id].lon || 0,
                            fov: data.panorams[pano.id].fov || Tour.options.fov
                        })
                    }.bind(this, pano)
                })
            }
        }

        Tour.on('changeView', function(view){
            UI.gallery.setActive(view.id)
        })
    }
};
