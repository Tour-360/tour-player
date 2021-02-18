/* globals Tour, THREE*/

Tour.Media = function(options) {
    this.type = options.type;
    if(options.type == 'video'){
        this.videoElement = document.createElement('video');
        this.videoElement.preload = options.preload || 'none';
        this.videoElement.src = options.src;
        this.videoElement.autoplay =  options.autoplay;
        this.videoElement.loop = options.loop;
        this.videoElement.muted = options.muted == undefined ? true : false;
        this.texture = new THREE.VideoTexture(this.videoElement);
    }
};

Tour.Media.prototype.play = function(){
    this.videoElement.play();
}

