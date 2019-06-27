/* globals Tour, THREE, UI, Lang */

/**
 * Устанавливает текстуру указанной панорамы
 *
 * @param {Number} id идентификатор панорамы
 */
Tour.setTexture = function(id) {
    UI.controlPanel.setProgress(0);

    if (this.loadingManager) {
        this.loadingManager.abort();
    }

    this.loadingManager = new Tour.LoadingManager();
    this.loadingManager.onprogress = function(event) {
        UI.controlPanel.setProgress(event.progress);
    };
    this.loadingManager.onerror = function() {
        UI.notification.show(Lang.get('notification.error-load-pano'));
    };

    var loader = new THREE.ImageLoader();
    loader.load(this.options.path + id + '/thumbnail/0.jpg', function(img) {

        this.backgroundImage.transitionEnd();

        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        var faces = this.detectFaceInCamera();

        for (var i = 0; i < 6; i++) {
            var planeId = this.options.tileset[i];
            var imgeURL = this.options.path + id + '/' + this.options.imageType + '/' + planeId + '.jpg';
            var tile = ctx.getImageData(planeId * img.height, 0, img.height, img.height);

            if (this.options.rendererType == 'css') {
                var tempcanvas = document.createElement('canvas');
                tempcanvas.width = tempcanvas.height = img.height;
                var tempctx = tempcanvas.getContext('2d');
                tempctx.putImageData(tile, 0, 0);
                this.mesh.children[i].element.src = tempcanvas.toDataURL('image/jpeg');
            } else {
                var texture = new THREE.Texture(tile);
                texture.needsUpdate = true;
                this.needsUpdate = true;
                this.mesh.material[i].map = this.options.rendererType != 'canvas' ? texture : tile;
            }

            setTimeout(function(i, imgeURL, manager) {
                this.setPlane(i, imgeURL, manager);
            }.bind(this, i, imgeURL, this.loadingManager), faces[i] ? 0 : 500);
        }
    }.bind(this), undefined, function() {
        UI.notification.show(Lang.get('notification.error-load-pano'));
    });
};
