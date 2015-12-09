/* globals Tour, THREE*/

Tour.createScene = function() {
    this.setRenderer(Tour.options.rendererType, Tour.options.imageType);
    document.body.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();

    if (Tour.options.rendererType == 'css') {

    } else {
        var segments = Tour.options.rendererType == 'canvas' ? 8 : 1;
        var geometry = new THREE.BoxGeometry(-100, 100, 100, segments, segments, segments);
        var materials = [];
        for (var i = 0; i < 6; i++) {
            materials.push(new THREE.MeshBasicMaterial({map: new THREE.Texture(), overdraw: true}));
        }
        this.mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
    }

    this.scene.add(this.mesh);
    this.resize();
};
