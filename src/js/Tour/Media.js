/* globals Tour, THREE*/

Tour.Media = function(options) {
    this.type = options.type;

    var that = this

    var updateVideo = function(){
        Tour.needsUpdate = true;
        that.videoElement.requestVideoFrameCallback(updateVideo);
    }

    if(options.type == 'video'){
        this.videoElement = document.createElement('video');
        this.videoElement.preload = options.preload || 'none';
        this.videoElement.src = options.src + Tour.getRandomQuery();
        this.videoElement.autoplay =  options.autoplay;
        this.videoElement.loop = options.loop;
        this.videoElement.muted = options.muted == undefined ? true : false;
        this.videoElement.preload = 'none'
        this.texture = new THREE.VideoTexture(this.videoElement);
        if('requestVideoFrameCallback' in this.videoElement){
            this.videoElement.requestVideoFrameCallback(updateVideo);
        }
    }
};

Tour.Media.prototype.play = function(){
    this.videoElement.play();
}

