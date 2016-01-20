/* globals Tour */

Tour.ImageLoader = function(manager) {
    this.manager = manager || new Tour.LoadingManager();
    this.manager.add(this);
};

Tour.ImageLoader.prototype.load = function(url, onload, onprogress, onerror) {
    this.url = url;
    this.onload = this.onload || onload;
    this.onprogress = this.onprogress || onprogress;
    this.onerror = this.onerror || onerror;

    this.request = new XMLHttpRequest();
    this.request.onprogress = this._onprogress.bind(this);
    this.request.onload = this._onload.bind(this);

    this.request.onreadystatechange = function(event) {
        if (this.onerror && event.target.readyState == 4 && event.target.status != 200) {
            this.onerror({code: event.target.status});
        }
    }.bind(this);

    this.request.open('GET', url, true);
    this.request.responseType = 'arraybuffer';
    this.request.send(null);
};

Tour.ImageLoader.prototype._onload = function() {
    var headers = this.request.getAllResponseHeaders();
    var mimeType = headers.match(/^Content-Type\:\s*(.*?)$/mi)[1] || 'image/jpeg';

    this.image = new Image();
    this.image.src = window.URL.createObjectURL(new Blob([this.request.response], {type: mimeType})) || this.url;
    this.image.onload = this._onimageload.bind(this);
    this.image.onerror = this.onerror;
};

Tour.ImageLoader.prototype._onprogress = function(event) {
    this.onprogress({
        url: this.url,
        progress: event.loaded / event.total
    });
};

Tour.ImageLoader.prototype._onimageload = function() {
    this.onload(this.image);
};
