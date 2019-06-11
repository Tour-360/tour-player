/* globals Tour, THREE */

Tour.backgroundImage = {};

Tour.backgroundImage.init = function() {
    var wrapper = document.createElement('div');
    wrapper.className = 'background-image__wrapper';

    this.domElement = new Image();
    this.domElement.id = 'background-image';

    wrapper.appendChild(this.domElement);
    document.body.appendChild(wrapper);
    if (Tour.options.rendererType != 'css') {
        document.body.classList.add('transition-zoomin-start');
    }
};

Tour.backgroundImage.set = function(url, color, callback) {
    if (color) {
        document.body.style.backgroundColor = color;
        Tour.renderer.setClearColor(new THREE.Color(color), 1);
    }

    if (url) {
        this.domElement.onload = callback;
        this.domElement.src = url;
    } else if (callback) {
        callback();
    }
};

Tour.backgroundImage.transitionStart = function(callback, zoom) {
    this.zoom = zoom;
    var after = function() {
        Tour.data.backgroundImage = false;
        document.body.classList.add(zoom ? 'transition-zoomin-start' : 'transition-fadein-start');
        document.body.classList.remove('transition-zoomin-end', 'transition-fadein-end');
        if (callback) {
            callback();
        }
    };

    if (Tour.options.rendererType != 'css' && Tour.options.transition) {
        var imageUrl = Tour.mesh.material[0].map.image ?
            Tour.renderer.domElement.toDataURL('image/jpeg') : Tour.data.backgroundImage;
        this.set(imageUrl, Tour.data.backgroundColor, after);
    } else {
        after();
    }
};

Tour.backgroundImage.transitionEnd = function() {
    document.body.classList.add(Tour.backgroundImage.zoom ? 'transition-zoomin-end' : 'transition-fadein-end');
    document.body.classList.remove('transition-zoomin-start', 'transition-fadein-start');
};
