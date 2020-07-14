/* globals Tools */

Tools.areaEditor = {
    drawMode: false
}

Tools.areaEditor.set = function() {
    UI.notification.show('Draw mode on', 300);
    Tour.renderer.domElement.style.pointerEvents = 'none'
    document.body.style.cursor = 'crosshair'
    UI.controlPanel.visibility = true; Tour.controls.toggleMenu();

    var dist = 10

    var vFOV = THREE.Math.degToRad( Tour.camera.fov );
    var height = 2 * Math.tan( vFOV / 2 ) * dist; 
    var width = height * Tour.camera.aspect;

    var geometry = new THREE.PlaneGeometry(width, height);
    var material = new THREE.MeshBasicMaterial( {color: 0x000000, transparent: true} );
    material.opacity = 0.2;
    this.plane = new THREE.Mesh( geometry, material );

    var vector = new THREE.Vector3(0, 0, -1);
    vector.applyEuler(Tour.camera.rotation, Tour.camera.rotation.order);
    this.plane.position.set(vector.x*dist, vector.y*dist, vector.z*dist);
    this.plane.lookAt(Tour.camera.position)
    Tour.scene.add( this.plane );


    var geometry = new THREE.ShapeGeometry( new THREE.Shape() );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true } );
    material.opacity = 0.6;
    this.mesh = new THREE.Mesh( geometry, material ) ;
    this.mesh.rotation.copy(this.plane.rotation);
    this.mesh.position.copy(this.plane.position);
    Tour.scene.add( this.mesh );

    this.points = [];
    this.peaks = [];

    this.mouseupUpEvent = this.mouseup.bind(this);
    this.mousemoveEvent = this.mousemove.bind(this);
    this.keyDownEvent = this.keyDown.bind(this);

    window.addEventListener('mouseup', this.mouseupUpEvent);
    window.addEventListener('mousemove', this.mousemoveEvent);
    window.addEventListener('keydown', this.keyDownEvent);
}

Tools.areaEditor.keyDown = function(event) {
    switch (event.code) {
        case 'Slash': this.copyAll(); break;
    }
}


Tools.areaEditor.copyAll = function(){
    var panorama = Tour.getPanorama()
    if(!panorama.areas){
        panorama.areas = [];
    }
    var strings = [',', '      "areas": ['];
    var areas = [];

    panorama.areas.forEach(function(area){
        areas.push('        ' + JSON.stringify(area, null, ''));
    })
    strings.push(areas.join(',\n'));

    strings.push('      ]');
    Tour.controls.copyText(strings.join('\n'));
    UI.notification.show('Id of this panorama: ' + Tour.view.id);
    Tools.areaEditor.init();
}

Tools.areaEditor.save = function(){
    console.log('save')

    var id = prompt('Enter popup id');
    var area = {
        action: {type: 'popup', id: id},
        points: this.peaks.map(function(peak){
            return [parseFloat(peak.x.toFixed(3)), parseFloat(peak.y.toFixed(3))]
        }),
        rotation: [
            parseFloat(this.plane.rotation.x.toFixed(3)),
            parseFloat(this.plane.rotation.y.toFixed(3)),
            parseFloat(this.plane.rotation.z.toFixed(3))
        ],
        position: [
            parseFloat(this.plane.position.x.toFixed(3)),
            parseFloat(this.plane.position.y.toFixed(3)),
            parseFloat(this.plane.position.z.toFixed(3))
        ]
    }

    var panorama = Tour.getPanorama()
    if(! panorama.areas){
        panorama.areas = [];
    }
    panorama.areas.push(area);
    Tour.areasManager.set();

    var code = JSON.stringify(area, null, '');
    Tour.controls.copyText(code);
}

Tools.areaEditor.mouseup = function(event){
    if(document.body.style.cursor == 'copy'){
        this.save();
        this.init();
    }else{
        this.peaks.push(this.getVector(event))
        this.draw();
    }
}

Tools.areaEditor.getVector = function(event){
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, Tour.camera);
    var intersects = raycaster.intersectObject(this.plane);
    var vector = new THREE.Vector3().copy( intersects[ 0 ].point );
    intersects[ 0 ].object.worldToLocal( vector );
    return vector;
}


Tools.areaEditor.mousemove = function(event){
    var vector = this.getVector(event)
    if(this.peaks[0] && Math.sqrt(Math.pow(Math.abs(vector.x - this.peaks[0].x), 2) + Math.abs(vector.y - this.peaks[0].y)) < 0.2){
        document.body.style.cursor = 'copy'
        this.points = this.peaks.concat();
    }else{
        document.body.style.cursor = 'crosshair'
        this.points = this.peaks.concat([vector]);
    }
    this.draw();
}

Tools.areaEditor.draw = function(){
    if(this.points.length >= 3){
        var shape = new THREE.Shape();
        shape.moveTo(this.points[0].x, this.points[0].y);

        for(var i=1; i<this.points.length; i++){
            shape.lineTo(this.points[i].x, this.points[i].y);
        }
        shape.lineTo(this.points[0].x, this.points[0].y);

        this.mesh.geometry = new THREE.ShapeGeometry( shape );
        Tour.needsUpdate = true;
    }
}

Tools.areaEditor.clear = function() {
    Tour.renderer.domElement.style.pointerEvents = document.body.style.cursor = ''
    Tour.scene.remove(this.plane);
    Tour.scene.remove(this.mesh);

    window.removeEventListener('mouseup', this.mouseupUpEvent);
    window.removeEventListener('mousemove', this.mousemoveEvent);
    window.removeEventListener('keydown', this.keyDownEvent)
}

Tools.areaEditor.init = function() {
    this.drawMode = !this.drawMode;
    this.drawMode? this.set() : this.clear();
    Tour.needsUpdate = true;
}