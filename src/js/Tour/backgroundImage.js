/* globals Tour, THREE */

Tour.backgroundImage = {};

Tour.backgroundImage.init = function() {
    this.domElement = new Image();
    this.domElement.id = 'background-image';
    document.body.appendChild(this.domElement);
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
