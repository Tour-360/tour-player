/* globals Tour, THREE*/

/**
 * Устанавливает текстуру одной стороны куба
 *
 * @param {Number} id идентификатор стороны
 * @param {String} url путь к изображению
 */
Tour.setPlane = function(id, url) {
    if (this.rendererType == 'css') {

    } else {
        var loader = new THREE.ImageLoader();
        loader.load(url, function(img) {
            var texture = new THREE.Texture(img);
            texture.needsUpdate = true;
            Tour.mesh.material.materials[id].map = texture;
        }, false, function() {
            Tour.log('Ошибка загрузки панорамы');
        });
    }
};
