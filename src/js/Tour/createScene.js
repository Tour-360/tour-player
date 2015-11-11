/* globals Tour, THREE*/

Tour.createScene = function() {
    this.camera = new THREE.PerspectiveCamera(this.view.fov, window.innerWidth / window.innerHeight, 1, 1100);
    this.camera.target = new THREE.Vector3(0, 0, 0);

    this.scene = new THREE.Scene();

    this.setRenderer(Tour.options.renderer, Tour.options.image);
    document.body.appendChild(this.renderer.domElement);

    if (this.rendererType == 'css') {

    } else {
        var segments = this.rendererType == 'canvas' ? 8 : 1;
        var geometry = new THREE.BoxGeometry(-100, 100, 100, segments, segments, segments);
        var materials = [];
        for (var i = 0; i < 6; i++) {
            materials.push(new THREE.MeshBasicMaterial());
        }
        this.mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
    }

    this.scene.add(this.mesh);
    this.animate();
};
