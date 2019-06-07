/* globals Tour */

Tour.LoadingManager = function(onload, onprogress, onerror) {
    this.images = [];
    this.loaders = [];
    this.onload = this.onload || onload;
    this.onprogress = this.onprogress || onprogress;
    this.onerror = this.onerror || onerror;
};

Tour.LoadingManager.prototype.add = function(loader) {
    loader.onerror = this.onerror;
    this.loaders.push(loader);

    loader.onprogress = function(event) {
        this.images[event.url] = event.progress;
        var sum = 0;
        for (var k in this.images) {sum += this.images[k];}
        var progress = sum / this.images.length;

        if (this.onprogress) {
            this.onprogress({progress: progress});
        }
    }.bind(this);

    var that = this;
    loader.oncomplete = function(){
        var completeAll = that.loaders.every(function(n){return n.image && n.image.complete})
        if(completeAll && that.onload){
            that.onload();
        }
    }

    this.images.length++;
};

Tour.LoadingManager.prototype.abort = function() {
    this.loaders.map(function(loader) {
        loader.abort();
    });
};
