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
        this.texture.anisotropy = BrouserInfo.mobile? 1 : Tour.renderer.capabilities.getMaxAnisotropy()/2;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.minFilter = THREE.LinearFilter;
        if('requestVideoFrameCallback' in this.videoElement){
            this.videoElement.requestVideoFrameCallback(updateVideo);
        }
    }else if(options.type == 'image'){
        this.texture = new THREE.TextureLoader().load(options.src);
        this.texture.anisotropy = BrouserInfo.mobile? 1 : Tour.renderer.capabilities.getMaxAnisotropy()/2;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.minFilter = THREE.LinearMipmapLinearFilter;
    }
};

Tour.Media.prototype.play = function(){
    if(this.type == 'video'){
        var promise = this.videoElement.play();
        if(promise){
            promise.catch(function(e){
                console.warn(e)
            })
        }
    }
}

Tour.Media.prototype.pause = function(){
    if(this.type == 'video'){
        this.videoElement.pause();
    }
}


