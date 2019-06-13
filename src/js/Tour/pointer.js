/* globals Tour, THREE, UI*/

Tour.pointer = {};

Tour.pointer.init = function(){
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = 32;
    this.ctx = this.canvas.getContext('2d');

    this.geometry = new THREE.PlaneGeometry( 1, 1, 1 );
    this.texture = new THREE.Texture(this.canvas);
    this.material = new THREE.MeshBasicMaterial( { map: this.texture, transparent: true } );
    this.plane = new THREE.Mesh(this.geometry, this.material );
    this.plane.position.set(0,0,-12);
    // this.plane.scale.set(.005, .005, .005);
    this.reviousIntersect = false;
    this.percent = 0;
    this.reviousintersect = false;

    this.material.alphaTest = 0.5;
    this.material.side = THREE.DoubleSide;

    Tour.camera.add(this.plane);
    Tour.scene.add(Tour.camera);
    this.draw();
}

Tour.pointer.drawCtx = function(color, width, length, alpha){
    this.ctx.globalAlpha = alpha;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.beginPath();
    this.ctx.arc(16, 16, 10, -Math.PI/2, length*2 * Math.PI);
    this.ctx.stroke();
    this.ctx.globalAlpha = 1;
}


Tour.pointer.draw = function(){
    if(Tour.vrEnabled){
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x: 0, y: 0 }, Tour.camera);
        var intersects = raycaster.intersectObjects(Tour.markersGroup.children);

        if(intersects.length){
            var marker = intersects[0].object.marker
            console.log(intersects)
            if(marker == this.reviousintersect){
                this.percent+=0.01;
                if(this.percent>=1){
                    marker.buttonDomElement.click()
                    this.percent = 0;
                }
            }else{
                this.percent = 0;
            }
            this.reviousintersect = marker
        }else{
            this.reviousintersect = false;
            this.percent = 0;
        }

        this.canvas.width = this.canvas.height;
        this.drawCtx('#fff', 4, 1, this.percent?Math.max(0.5, 1-this.percent*2):1);
        this.drawCtx('#fff', 4, this.percent, 1);
        this.texture.needsUpdate = true;
    }
    this.plane.visible = Tour.vrEnabled;
}
