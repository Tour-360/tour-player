/* globals Tools */

Tools.meshEditor = function(id, lat) {
    this.selectedMesh = false;
    this.durationCrop = 0;

    function onMouseMove( event ) {
        var mouse = new THREE.Vector2();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera( mouse, Tour.camera );
        var intersects = raycaster.intersectObjects( Tour.meshs );

        Tour.meshs.forEach(function (n) {
            n.material.color && n.material.color.set( 0xffffff );
            n.material.opacity = 1;
        })

        Tools.selectedMesh = false;

        for ( var i = 0; i < intersects.length; i++ ) {
            if(intersects[ i ].object.material.color){
                intersects[ i ].object.material.color.set( 0xff0000 );
                intersects[ i ].object.material.opacity = 0.6;
                Tools.selectedMesh = intersects[ i ].object;
            }
        }
    }

    window.addEventListener('keydown', function(event) {
        var alpha = 0.1
        console.log(event)
        if(event.altKey)  alpha/=10;
        if(event.ctrlKey)  alpha/=10;
        if(event.shiftKey) alpha*=10;

        var sm = Tools.selectedMesh;

        if(sm){
            console.log(event.keyCode);
            if(event.keyCode == 74){ //J
                sm.position.z -= 1*alpha;
            }else if(event.keyCode == 76){ //L
                sm.position.z += 1*alpha;
            }else if(event.keyCode == 73){ //K
                sm.position.x += 1*alpha;
            }else if(event.keyCode == 75){ //K
                sm.position.x -= 1*alpha;
            }else if(event.keyCode == 85){ //K
                sm.position.y += 1*alpha;
            }else if(event.keyCode == 79){ //K
                sm.position.y -= 1*alpha;
            }else if(event.keyCode == 219){ //{
                sm.rotation.y += Math.PI/2*alpha;
            }else if(event.keyCode == 221){ // }
                sm.rotation.y -= Math.PI/2*alpha;
            }else if(event.keyCode == 57){ // (
                sm.rotation.z += Math.PI/2*alpha;
            }else if(event.keyCode == 48){ // )
                sm.rotation.z -= Math.PI/2*alpha;
            }else if(event.keyCode == 188){ // (
                sm.rotation.x += Math.PI/2*alpha;
            }else if(event.keyCode == 190){ // )
                sm.rotation.x -= Math.PI/2*alpha;
            }else if(event.keyCode == 84){ // (
                sm.scale.x += 1*alpha;
            }else if(event.keyCode == 89){ // )
                sm.scale.x -= 1*alpha
            }else if(event.keyCode == 71){ // (
                sm.scale.y += 1*alpha;
            }else if(event.keyCode == 72){ // )
                sm.scale.y -= 1*alpha
            }else if(event.keyCode == 86){ // v
                Tools.durationCrop = ++Tools.durationCrop%4;
                UI.notification.show('Set duration crop '+['top', 'right', 'bottom', 'left'][Tools.durationCrop])
            }else if(event.keyCode == 66){ // b
                if(Tools.durationCrop == 0){
                    sm.material.map.repeat.y /= 1.1;
                    sm.material.map.offset.y /= 1.1;
                    Tools.selectedVideo.scale.y /= 1.1;
                }else if(Tools.durationCrop == 1){
                    sm.material.map.repeat.x /= 1.1;
                    sm.material.map.offset.x /= 1.1;
                    sm.scale.x /= 1.1;
                }else if(Tools.durationCrop == 2){
                    sm.material.map.repeat.y -= 0.1;
                    sm.scale.y = sm.material.map.repeat.y;
                }else if(Tools.durationCrop == 3){
                    sm.material.map.repeat.x -= 0.1;
                    sm.scale.x = sm.material.map.repeat.x;
                }

            }else if(event.keyCode == 78){ // n
                if(Tools.durationCrop == 0){
                    sm.material.map.repeat.y *= 1.1;
                    sm.material.map.offset.y *= 1.1;
                    sm.scale.y *= 1.1;
                }else if(Tools.durationCrop == 1){
                    sm.material.map.repeat.x *= 1.1;
                    sm.material.map.offset.x *= 1.1;
                    sm.scale.x *= 1.1;
                }else if(Tools.durationCrop == 2){
                    sm.material.map.repeat.y += 0.1;
                    sm.scale.y = sm.material.map.repeat.y;
                }else if(Tools.durationCrop == 3){
                    sm.material.map.repeat.x += 0.1;
                    sm.scale.x = sm.material.map.repeat.x;
                }
            }



            var fix = function(n){
                return parseFloat(parseFloat(n).toFixed(4));
            }

            if(event.code == 'Digit8' && Tools.selectedMesh){
                var mesh = {}
                var sm = Tools.selectedMesh;
                mesh.position = {x: fix(sm.position.x), y: fix(sm.position.y), z: fix(sm.position.z)}
                mesh.rotation = {x: fix(sm.rotation.x), y: fix(sm.rotation.y), z: fix(sm.rotation.z)}
                if(sm._videoId){
                    var alpha = Tour.videos[sm._videoId].canvas.height / Tour.videos[sm._videoId].canvas.width; 
                    mesh.scale = {
                        x: fix(sm.scale.x / Tour.videos[sm._videoId].texture.repeat.x), 
                        y: fix(sm.scale.y / Tour.videos[sm._videoId].texture.repeat.y) / alpha,
                        z: fix(sm.scale.z)
                    }
                    mesh.videoId = sm._videoId;
                }else{
                    var alpha = Tour.images[sm._imageId].height / Tour.images[sm._imageId].width; 
                    mesh.scale = {
                        x: fix(sm.scale.x), 
                        y: fix(sm.scale.y / alpha),
                        z: fix(sm.scale.z)
                    }
                    mesh.imageId = sm._imageId;
                }

                Tour.controls.copyText(JSON.stringify(mesh))
            }
        }
    });


    document.body.addEventListener('click', onMouseMove, false );
};
