/* globals Tour, Lang */

Tour.setMarkers = function() {
    if (this.markers) {
        this.markers.forEach(function(marker) {
            marker.remove();
        });
    }

    this.markers = [];
    var markers = this.data.panorams && this.data.panorams[this.view.id] && this.data.panorams[this.view.id].markers;

    if (markers) {
        /* Типы действий
         * github.com/Tour-360/tour-player/wiki/Формат-файла-manifest.json#action
         */
        var action = function() {
            if (this.action.type == 'panorama') {
                Tour.view.set(this.action);
            } else if (this.action.type == 'url') {
                window.open(this.action.href, this.action.target || '_blank');
            } else if (this.action.type == 'window') {

            }
        };

        for (var i = 0; i < markers.length; i++) {
            var marker = new this.Marker(markers[i].lat, markers[i].lon, action.bind(markers[i]));

            var title = markers[i].title ||
            (markers[i].action.type == 'panorama' && this.data.panorams[markers[i].action.id].title);

            marker.setTitle(Lang.translate(title));
            marker.setIcon(markers[i].icon);
            this.markers.push(marker);
        }
    }
};
