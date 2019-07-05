/* globals Tour*/

Tour.detectFaceInCamera = function() {
    var raycaster = new THREE.Raycaster();
    var faces = [0,0,0,0,0,0];
    var vector = new THREE.Vector2();
    for (var y = -1; y < 1; y += 0.2) { for (var x = -1; x < 1; x += 0.2) {
        vector.x = x; vector.y = y;
        raycaster.setFromCamera(vector, this.camera);
        var intersects = raycaster.intersectObjects(this.scene.children);
        if (intersects.length && intersects[0].object == this.mesh) {
            faces[intersects[0].face.materialIndex] += intersects[0].distance ? 1 : 0;
        }
    }}
    return faces;
};
