/* globals Tour, Lang, UI */

Tour.setMarkers = function(id) {
    if (this.markers) {
        this.markers.forEach(function(marker) {
            marker.remove();
        });
    }

    this.markers = [];
    var pano = this.getPanorama(id);
    var markers = pano && pano.markers;

    if (markers) {
        /* Типы действий
         * github.com/Tour-360/tour-player/wiki/Формат-файла-manifest.json#action
         */
        var action = function(marker) {
            if (this.type == 'panorama') {
                Tour.view.set(this);
            } else if (this.type == 'url') {
                window.open(this.href, this.target || '_blank');
            } else if (this.type == 'popup') {
                UI.popUp.set(this.id);
            } else if (this.type == 'window') {

            } else if (this.type == 'change') {
                this.click = this.click + 1 || 0;
                if(Array.isArray(marker.title)){
                    console.log(this.click, marker.title.length)
                    Tour.markers[marker.index].setTitle(Lang.translate(marker.title[this.click % marker.title.length]));
                }
                var manager = new Tour.LoadingManager();
                manager.onprogress = function(event) {
                    UI.controlPanel.setProgress(event.progress);
                };
                for (var k in this.planes) {
                    var planeId = this.planes[k][this.click % this.planes[k].length];
                    var imgeURL = Tour.options.path + id + '/' + Tour.options.imageType + '/' + planeId + '.jpg';

                    Tour.setPlane(k, imgeURL, manager);
                }
            }
        };

        for (var i = 0; i < markers.length; i++) {
            var marker = new this.Marker(markers[i].lat, markers[i].lon, action.bind(markers[i].action, markers[i]));

            var title = (Array.isArray(markers[i].title) ? markers[i].title[markers[i].title.length-1] : markers[i].title) ||
            (markers[i].action.type == 'panorama' && this.getPanorama(markers[i].action.id).title);

            marker.setTitle(Lang.translate(title));
            marker.setIcon(
                markers[i].icon ||
                (markers[i].action && markers[i].action.type == 'panorama' ? 'up' : 'info')
            );
            markers[i].index = this.markers.push(marker)-1;
        }
    }
};
