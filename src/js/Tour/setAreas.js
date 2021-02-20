Tour.Area = function(options){
  this.options = options;
  this.shape = new THREE.Shape();
    this.shape.moveTo(options.points[0][0], options.points[0][1]);
    for(var i=1; i<options.points.length; i++){
        this.shape.lineTo(options.points[i][0], options.points[i][1]);
    }
    this.shape.lineTo(options.points[0][0], options.points[0][1]);

  this.geometry = new THREE.ShapeGeometry( this.shape );

    if(options.type == 'media'){
        this.geometry = new THREE.Geometry();
        var s = 8;
        var v = this.options.points.map(function(p){
            return {x:p[0], y:p[1]}
        })
        for(var a=0; a<=s; a++){
            for(var b=0; b<=s; b++){
                var d = {
                    x: v[0].x - (v[0].x - v[3].x) / s * a,
                    y: v[0].y - (v[0].y - v[3].y) / s * a
                }
                var c = {
                    x: v[1].x - (v[1].x - v[2].x) / s * a,
                    y: v[1].y - (v[1].y - v[2].y) / s * a
                }
                var x = c.x - (c.x - d.x) / s * b;
                var y = c.y - (c.y - d.y) / s * b;
                this.geometry.vertices.push(new THREE.Vector3(x, y, 0))
            }
        }

        var a = 1-1/s;
        var b = 1/s

        for(var y=0; y<s; y++)for(var x=0; x<=s; x++){
            var n = y*(s+1)+x
            if(n==0 || (n%s)-((Math.floor(n/s)-1)) != 0)this.geometry.faces.push(
               new THREE.Face3(n, n+1, n+s+2),
               new THREE.Face3(n+s+2, n+s+1, n)
            );
            if(x!=s){
                this.geometry.faceVertexUvs[0].push(
                    [
                        {x:1 - x*b, y:1- y*b},
                        {x:a- x*b, y:1- y*b},
                        {x:a- x*b, y:a- y*b}
                    ],
                    [
                        {x:a- x*b, y:a- y*b},
                        {x:1- x*b, y:a- y*b},
                        {x:1- x*b, y:1- y*b}
                    ]
                )
            }
        }
        if(this.options.mediaId && Tour.media[this.options.mediaId]){
            this.material = new THREE.MeshBasicMaterial( { map: Tour.media[this.options.mediaId].texture, transparent: true, side: THREE.DoubleSide} ); 
            Tour.media[this.options.mediaId].play();
            Tour.animateMedia = true;
        }else{
            this.material = new THREE.MeshBasicMaterial( { color: 0xff0000, transparent: true, opacity: 0.5, side: THREE.DoubleSide} );
        }

    }else if(options.type == 'mask'){
        this.material = new THREE.MeshBasicMaterial( {colorWrite: false} );
    }else{
        if(!Tools.active){
            this.material = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0} );
        }else{
            var texture = new THREE.DataTexture(new Uint8Array([255, 255, 255, 204, 204, 204, 204, 204, 204, 255, 255, 255]), 2, 2, THREE.RGBFormat)

            texture.magFilter = THREE.NearestFilter;
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            var position = options.position;
            var distance = (new THREE.Vector3(position[0], position[1], position[2]).distanceTo(Tour.camera.position));
            texture.repeat.set(20/distance, 20/distance);
            this.material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, opacity : 0.5} );
        }
    }

    this.mesh = new THREE.Mesh(this.geometry, this.material ) 

    this.mesh.rotation.set(options.rotation[0], options.rotation[1], options.rotation[2]);
    this.mesh.position.set(options.position[0], options.position[1], options.position[2]);
    if(options.type == 'shape'){
        this.mesh._onclick = this.go.bind(this)
        this.mesh._onhover = this.setActive.bind(this, true);
        this.mesh._onover = this.setActive.bind(this, false);
    }
    this.mesh._title = !Tools.active? Lang.translate(UI.renderAreaTitle(options)) : 'id: '+options.id;

    Tour.areasManager.areas.add( this.mesh );
}

Tour.Area.prototype.go = function(event){
    if(Tools.active && event.altKey){
        Tools.editor.areaEditor.edit(this.options);
        return false
    }

  var action = this.options.action
  if(action){
      if (action.type == 'panorama') {
          Tour.view.set(action, null, Math.abs(Tour.view.lat.value) < 45);
      } else if (action.type == 'url') {
          window.open(action.href, action.target || '_blank');
      } else if (action.type == 'popup') {
          UI.popUp.set(action.id);
      } else {
            Tour.emmit('areaclick', this.options);
        }
  }
}

Tour.Area.prototype.setActive = function(value){
  this.material.opacity = value ? 0.2 : (Tools.active?0.5 :0);
  Tour.needsUpdate = true;
}

Tour.areasManager = {};

Tour.areasManager.init = function() {
  this.areas = new THREE.Group();
  Tour.scene.add(this.areas);
}

Tour.areasManager.set = function(id) {
  while(this.areas.children.length > 0){ 
        this.areas.remove(this.areas.children[0]);
    }

    Tour.areas = [];
    var areas = Tour.getPanorama(id).areas || [];
    areas.forEach(function(areaOptions) {
        if(!areaOptions.action){
            return false;
        }
        var area = new Tour.Area(areaOptions);
        Tour.areas.push(area);
    })
    Tour.areasManager.areas.rotation.y = Tour.mesh.rotation.y;

    Tour.needsUpdate = true;
}

