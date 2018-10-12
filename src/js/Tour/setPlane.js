/* globals Tour, THREE, UI, Lang*/

/**
 * Устанавливает текстуру одной стороны куба
 *
 * @param {Number} id идентификатор стороны
 * @param {String} url путь к изображению
 */
Tour.setPlane = function(id, url, manager) {
    if (this.options.rendererType == 'css') {
        this.mesh.children[id].element.src = url;
    } else {
        var loader = new Tour.ImageLoader(manager);
        loader.load(url, function(img) {
            var texture = new THREE.Texture(img);
            texture.needsUpdate = true;
            Tour.mesh.material[id].map = texture;
            Tour.needsUpdate = true;
        }, null, function() {
            UI.notification.show(Lang.get('notification.error-load-img'));
        });
    }
};
