/* globals Tools */

Tools.pointEditor = {}

Tools.pointEditor.init = function() {
    this.geometry = new THREE.RingGeometry( 0.3, 0.4, 32 );
    this.material = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true} );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.rotation.set(-Math.PI/2, 0, 0);
    this.level = -Tour.options.heightFloor;
    this.opacity = 1;

    Tour.scene.add(this.mesh);

    Tour.on('moveview', this.set.bind(this));
    this.set();

    window.addEventListener('keydown', function(event) {
        switch (event.code) {
            case 'Enter':  this.copy(); break;
            case 'BracketLeft':  this.level-=0.1; break;
            case 'BracketRight':  this.level+=0.1; break;
            case 'KeyP':  this.level=-2; break;

            case 'Quote':  this.opacity-=0.2; this.showOpacity(); break;
            case 'Backslash':  this.opacity+=0.2; this.showOpacity();break;
            case 'Semicolon':  this.opacity=1; this.showOpacity(); break;

            case 'Slash': this.copyAll(); break;
        }
        this.set();
    }.bind(this));
}

Tools.pointEditor.showOpacity = function() {
	UI.notification.show(parseFloat(this.opacity.toFixed(2)), 200);
}

Tools.pointEditor.copyAll = function(){
	var panorama = Tour.getPanorama()
	if(!panorama.points){
    	panorama.points = [];
    }
    var strings = [',', '      "points": ['];
    var points = [];

    panorama.points.forEach(function(point){
    	points.push('        ' + JSON.stringify(point, null, ''));
    })
    strings.push(points.join(',\n'));

    strings.push('      ]');
    Tour.controls.copyText(strings.join('\n'));
    UI.notification.show('Id of this panorama: ' + Tour.view.id);
}

Tools.pointEditor.copy = function(){

	var pano = prompt('Enter pano id', Tour.view.id)

    var point = {
        lon: parseFloat(Tour.view.lon.value.toFixed(2)),
        distance: parseFloat(this.distance.toFixed(2)),
        level: parseFloat(this.level.toFixed(2)),
        pano: pano
    };

    if(this.opacity != 1){
    	point.opacity = parseFloat(this.opacity.toFixed(2));
    }


    var panorama = Tour.getPanorama()
    if(! panorama.points){
    	panorama.points = [];
    }
    panorama.points.push(point);
    Tour.pointsManager.set()

    var code = JSON.stringify(point, null, '');

    Tour.controls.copyText(code);
}

Tools.pointEditor.set= function(){
	var n = Tour.camera.rotation.y - Math.PI;
	this.distance = (1-Math.atan(-Tour.camera.rotation.x)) * 10;
	Tools.pointEditor.material.opacity = this.opacity * Tour.options.pointersOpacity
	this.mesh.position.set(Math.sin(n)*this.distance, this.level, Math.cos(n)*this.distance);
	Tour.needsUpdate = true;
}