/* globals Tour, Lang, UI */

Tour.setMesh = function(id) {
    if (this.meshs) {
        this.meshs.forEach(function(mesh) {
            if (mesh._videoId) {
                Tour.videos[mesh._videoId].needsUpdate = false;
            }
            Tour.scene.remove(mesh);
        });
    }

    this.meshs = [];

    var videos = this.data.panorams && this.data.panorams[id] && this.data.panorams[id].videos;

    if (videos) {
        for (var i = 0; i < videos.length; i++) {
            var options = videos[i];
            var videoOpt = Tour.videos[options.videoId]
            if (Tour.options.rendererType == 'css') {
                var video = new THREE.Object3D();
                var object = new THREE.CSS3DObject(videoOpt.videoElement);
                video.add(object);
                video.scale.set(
                    options.scale.x / 512,
                    options.scale.y / 512,
                    options.scale.z
                );
            } else {
                var plane = new THREE.PlaneGeometry(1, 1, 1, 1);

                var material = videoOpt.sprite > 1 ? new THREE.MeshBasicMaterial({map: videoOpt.texture, transparent: true}) : videoOpt.material;
                var video = new THREE.Mesh(plane, material);

                if(videoOpt.sprite > 1){
                    video.onBeforeRender = function(e){
                        video.material.map.offset.x = this;
                    }.bind(options.sprite * (1/videoOpt.sprite))
                }

                var alpha = videoOpt.canvas.height / videoOpt.canvas.width;
                video.scale.set(
                    options.scale.x * videoOpt.texture.repeat.x,
                    options.scale.y * videoOpt.texture.repeat.y * alpha,
                    options.scale.z
                );
            }
            videoOpt.needsUpdate = true;
            video.position.set(options.position.x, options.position.y, options.position.z);
            video.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);
            video._videoId = options.videoId;
            this.meshs.push(video);
            Tour.scene.add(video);
        }
    }

    var images = this.data.panorams && this.data.panorams[id] && this.data.panorams[id].images;
    if (images) {
        for (var i = 0; i < images.length; i++) {
            var options = images[i];
            var plane = new THREE.PlaneGeometry(1, 1, 1, 1);
            var image = new THREE.Mesh(plane, Tour.images[options.imageId].material);

            var alpha = Tour.images[options.imageId].height / Tour.images[options.imageId].width;
            image.position.set(options.position.x, options.position.y, options.position.z);
            image.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);
            image.scale.set(options.scale.x, options.scale.y * alpha, options.scale.z);
            image._imageId = options.imageId;
            this.meshs.push(image);
            Tour.scene.add(image);
        }
    }
};
