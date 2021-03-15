/* globals Tour */

Tour.WorkerLoader = function(manager) {
    this.manager = manager || new Tour.LoadingManager();
    this.manager.add(this);
};

Tour.WorkerLoader.prototype.load = function(url, onload, onprogress, onerror) {
    this.url = url;
    this.onload = this.onload || onload;
    this.onprogress = this.onprogress || onprogress;
    this.onerror = this.onerror || onerror;

    Tour.decodeFactory.load(
        location.origin+location.pathname+url+Tour.getRandomQuery(),
        this._onload.bind(this),
        this._onprogress.bind(this)
    )

};

Tour.WorkerLoader.prototype.abort = function() {
    // this.request.abort();
    this.onload = false;
};

Tour.WorkerLoader.prototype._onload = function(texture) {
    this.texture = texture;
    if(!this.complete)this._onprogress({
        url: this.url,
        progress: 1
    })
    this.complete = true;
    this._onimageload();
};

Tour.WorkerLoader.prototype._onprogress = function(event) {
    this.onprogress(event);
};

Tour.WorkerLoader.prototype._onimageload = function() {
    if (this.onload) { this.onload(this.texture); }
    if (this.oncomplete) { this.oncomplete(this.texture); }
};

