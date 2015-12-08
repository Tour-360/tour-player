/* globals Tour, THREE */

/**
 * Устанавливает текстуру указанной панорамы
 *
 * @param {Number} id идентификатор панорамы
 */
Tour.setTexture = function(id) {
    var loader = new THREE.ImageLoader();
    loader.load(this.options.path + id + '/thumbnail/0.jpg', function(img) {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        for (var i = 0; i < 6; i++) {
            var planeId = this.options.tileset[i];
            var imgeURL = this.options.path + id + '/' + this.options.imageType + '/' + planeId + '.jpg';
            if (this.options.rendererType == 'css') {

            } else {
                var texture = new THREE.Texture(ctx.getImageData(planeId * img.height, 0, img.height, img.height));
                texture.needsUpdate = true;
                this.mesh.material.materials[i].map = texture;
                this.setPlane(i, imgeURL);
            }
        }
    }.bind(this), false, function() {
        Tour.log('Ошибка загрузки панорамы');
    });
};
