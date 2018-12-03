/* globals Tour, THREE*/

Tour.Image = function(options) {
    this.loader = new THREE.TextureLoader();
    this.material = new THREE.MeshBasicMaterial({
      map: this.loader.load(options.src),
      transparent: true,
      // overdraw: 0.5,
      // needsUpdate: true,
      depthWrite: false
    });

    this.width = options.width;
    this.height = options.height;

};
//https://stackoverflow.com/questions/15994944/transparent-objects-in-threejs
