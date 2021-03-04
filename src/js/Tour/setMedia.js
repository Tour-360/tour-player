/* globals Tour */

Tour.setMedia = function(media) {
    if(!this.media)this.media = {};
    if (media) {
        for (var i = 0; i < media.length; i++) {
            this.media[media[i].id] = new Tour.Media(media[i]);
        }
    }
};

Tour.stopMedia = function() {
    for(k in this.media){
        this.media[k].pause();
    }
    this.animateMedia = false;
}
