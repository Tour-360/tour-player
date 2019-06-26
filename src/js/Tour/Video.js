/* globals Tour, THREE*/

Tour.Video = function(options) {
    this.videoElement = document.createElement('video');
    this.videoElement.src = options.src;
    // this.videoElement.autoplay =  options.autoplay || true;
    this.videoElement.loop = options.loop || true;
    this.videoElement.muted = options.muted || true;

    var _this = this;

    var sync = function() {
        if (_this.videoElement.duration && _this.needsUpdate) {
            _this.videoElement.currentTime = (Date.now() / 1000) % _this.videoElement.duration;
        }
    };

    if (options.sync) {
        clearTimeout(this.syncTimeout);

        Tour.on('changeView', function() {
            _this.syncTimeout = setTimeout(sync, 2000);
        });

        this.syncInterval = setInterval(sync, 10000);
    }

    // if(options.autoplay){
    //     this.videoElement.play();
    // }
    this.videoElement.pause();

    this.canvas = document.createElement('canvas');
    this.canvas.width = Math.pow(2, Math.ceil(Math.log(options.width) / Math.log(2)));
    this.canvas.height = Math.pow(2, Math.ceil(Math.log(options.height) / Math.log(2)));

    this.ctx = this.canvas.getContext('2d');

    this.texture = new THREE.Texture(this.canvas);
    this.texture.repeat.x = options.width / this.canvas.width;
    this.texture.repeat.y = options.height / this.canvas.height;
    this.texture.offset.y = 1 - this.texture.repeat.y;
    this.texture.needsUpdate = true;
    this.needsUpdate = true;

    this.material = new THREE.MeshBasicMaterial({map: this.texture, transparent: true});
};

Tour.Video.prototype.draw = function() {
    if (this.needsUpdate) {
        this.videoElement.play();
        if (Tour.options.rendererType != 'css') {
            this.ctx.drawImage(this.videoElement, 0, 0);
        }
        this.texture.needsUpdate = true;
        Tour.needsUpdate = true;
    } else {
        this.videoElement.pause();
    }
};
