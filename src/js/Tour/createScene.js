/* globals Tour, THREE*/

Tour.createScene = function() {
    this.setRenderer(Tour.options.rendererType, Tour.options.imageType);
    document.body.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();

    if (Tour.options.rendererType == 'css') {
        var sides = [
            [[-1,0, 0],[0,  0.5, 0]],
            [[1, 0, 0],[0, -0.5, 0]],
            [[0, 1, 0],[0.5,  0, 1]],
            [[0,-1, 0],[-0.5, 0, 1]],
            [[0, 0, 1],[0,    1, 0]],
            [[0, 0,-1],[0,    0, 0]]
        ];
        var increase = function(n) {return this * n;};
        this.mesh = new THREE.Object3D();
        for (var k = 0; k < sides.length; k++) {
            var element = document.createElement('img');
            var size = this.options.imageType == 'low' ? 1024 : 2048;
            element.ondragstart = function(event) { event.preventDefault(); };
            element.width = size + 2;
            var object = new THREE.CSS3DObject(element);
            object.rotation.fromArray(sides[k][1].map(increase.bind(Math.PI)));
            object.position.fromArray(sides[k][0].map(increase.bind(size / 2)));
            this.mesh.add(object);
        }
    } else {
        document.body.classList.add('transition');
        var segments = this.options.rendererType == 'canvas' ? 8 : 1;
        var geometry = new THREE.BoxGeometry(-100, 100, 100, segments, segments, segments);
        var materials = [];
        for (var i = 0; i < 6; i++) {
            materials.push(new THREE.MeshBasicMaterial({map: new THREE.Texture(), overdraw: true}));
        }
        this.mesh = new THREE.Mesh(geometry, materials);
    }

    this.mesh.rotation.y = Math.PI / 2;

    this.scene.add(this.mesh);
    this.resize();
};
