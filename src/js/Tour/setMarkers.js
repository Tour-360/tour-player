/* globals Tour, Lang, UI */

Tour.setMarkers = function(id) {
    if (this.markers) {
        this.markers.forEach(function(marker) {
            marker.remove();
        });
    }

    this.markers = [];
    var markers = this.data.panorams && this.data.panorams[id] && this.data.panorams[id].markers;

    if (markers) {
        /* Типы действий
         * github.com/Tour-360/tour-player/wiki/Формат-файла-manifest.json#action
         */
        var action = function() {
            if (this.type == 'panorama') {
                Tour.view.set(this);
            } else if (this.type == 'url') {
                window.open(this.href, this.target || '_blank');
            } else if (this.type == 'popup') {
                UI.popUp.set(this.id);
            } else if (this.type == 'window') {

            }
        };

        for (var i = 0; i < markers.length; i++) {
            var marker = new this.Marker(markers[i].lat, markers[i].lon, action.bind(markers[i].action));

            var title = markers[i].title ||
            (markers[i].action.type == 'panorama' && this.data.panorams[markers[i].action.id].title);

            marker.setTitle(Lang.translate(title));
            marker.setIcon(markers[i].icon);
            this.markers.push(marker);
        }
    }
};
