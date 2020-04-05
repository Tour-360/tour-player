/* globals Tour */

Tour.ImageBitmapLoader = function(manager) {
    this.manager = manager || new Tour.LoadingManager();
    this.manager.add(this);
};

Tour.ImageBitmapLoader.prototype.load = function(url, onload, onprogress, onerror) {
    this.url = url;
    this.onload = this.onload || onload;
    this.onprogress = this.onprogress || onprogress;
    this.onerror = this.onerror || onerror;

    this.request = new XMLHttpRequest();
    this.request.onprogress = this._onprogress.bind(this);
    this.request.onload = this._onload.bind(this);

    this.request.onreadystatechange = function(event) {
        if (this.onerror && event.target.readyState == 4 && event.target.status != 200 && event.target.status != 0) {
            this.onerror({code: event.target.status});
        }
    }.bind(this);

    this.request.open('GET', url, true);
    this.request.responseType = 'arraybuffer';
    this.request.send(null);
};

Tour.ImageBitmapLoader.prototype.abort = function() {
    this.request.abort();
    this.onload = false;
};

Tour.ImageBitmapLoader.prototype._onload = function() {
    var headers = this.request.getAllResponseHeaders();
    var mimeType = headers.match(/^Content-Type\:\s*(.*?)$/mi)[1] || 'image/jpeg';
    var options = { imageOrientation: 'flipY', resizeQuality: 'high' };
    var that = this;
    createImageBitmap(new Blob([this.request.response], {type: mimeType}), options).then(function(bitmap){
        that.bitmap = bitmap;
        that._onimageload();
    }).catch(function (err){
        that.onerror(err);
    })
};

Tour.ImageBitmapLoader.prototype._onprogress = function(event) {
    this.onprogress({
        url: this.url,
        progress: event.loaded / event.total
    });
};

Tour.ImageBitmapLoader.prototype._onimageload = function() {
    if (this.onload) { this.onload(this.bitmap); }
    if (this.oncomplete) { this.oncomplete(this.bitmap); }
};

