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
                Tour.view.set(this, null, Math.abs(Tour.view.lat.value) < 45);
            } else if (this.type == 'url') {
                window.open(this.href, this.target || '_blank');
            } else if (this.type == 'popup') {
                UI.popUp.set(this.id);
            } else if (this.type == 'window') {

            } else if (this.type == 'change') {
                this.click = this.click + 1 || 0;
                Tour.backgroundImage.transitionStart(function(){
                    if (Array.isArray(marker.title)) {
                        Tour.markers[marker.index].setTitle(Lang.translate(marker.title[this.click % marker.title.length]));
                    }
                    var manager = new Tour.LoadingManager();
                    manager.onprogress = function(event) {
                        UI.controlPanel.setProgress(event.progress);
                    };
                    manager.onload = function(event) {
                        Tour.backgroundImage.transitionEnd();
                    };
                    for (var k in this.planes) {
                        var planeId = this.planes[k][this.click % this.planes[k].length];
                        var imgeURL = Tour.options.path + id + '/' + Tour.options.imageType + '/' + planeId + '.jpg';

                        Tour.setPlane(k, imgeURL, manager);
                    }
                }.bind(this));
            }
        };

        for (var i = 0; i < markers.length; i++) {

            var m = markers[i];

            var marker = new this.Marker(
                m.lat,
                m.lon,
                action.bind(m.action, m)
            );

            var title = (
                Array.isArray(m.title) ? m.title[m.title.length - 1] : m.title) ||
                (markers[i].action.type == 'panorama' && this.getPanorama(m.action.id).title
            );

            if (!BrouserInfo.mobile) {
                marker.setTitle(Lang.translate(title));
            }
            marker.setIcon(
                m.icon ||
                (m.action && markers[i].action.type == 'panorama' ? 'up' : 'info')
            );
            m.index = this.markers.push(marker) - 1;
        }
    }
};
