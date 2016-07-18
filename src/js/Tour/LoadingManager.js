/* globals Tour */

Tour.LoadingManager = function(onload, onprogress, onerror) {
    this.images = [];
    this.onload = this.onload || onload;
    this.onprogress = this.onprogress || onprogress;
    this.onerror = this.onerror || onerror;
};

Tour.LoadingManager.prototype.add = function(loader) {
    loader.onerror = this.onerror;

    loader.onprogress = function(event) {
        this.images[event.url] = event.progress;
        var sum = 0;
        for (var k in this.images) {sum += this.images[k];}
        var progress = sum / this.images.length;

        if (this.onprogress) {
            this.onprogress({progress: progress});
        }
    }.bind(this);

    this.images.length++;
};
