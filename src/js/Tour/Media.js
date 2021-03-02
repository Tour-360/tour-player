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
        this.videoElement.src = ((BrouserInfo.mobile && Tour.options.mobileVideoScale)? options.src.replace('.', '@'+Tour.options.mobileVideoScale+'.'):options.src) + Tour.getRandomQuery();

        this.videoElement.setAttribute("playsinline", true);
        this.videoElement.setAttribute("loop", options.loop == undefined ? true : false);
        this.videoElement.setAttribute("muted", options.muted == undefined ? true : false);
        this.videoElement.setAttribute("autoplay", options.autoplay || false);
        this.videoElement.setAttribute("preload", 'none');
        this.videoElement.setAttribute("crossOrigin", "anonymous");

        this.texture = new THREE.VideoTexture(this.videoElement);
        if('requestVideoFrameCallback' in this.videoElement){
            this.videoElement.requestVideoFrameCallback(updateVideo);
        }
    }
};

Tour.Media.prototype.play = function(){
    var promise = this.videoElement.play();
    if(promise){
        promise.catch(function(e){
            console.warn(e)
        })
    }
}

