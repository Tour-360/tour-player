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
        var cib = typeof createImageBitmap !== 'undefined'
        var loader = cib ? new Tour.ImageBitmapLoader(manager) : new Tour.ImageLoader(manager);
        loader.load(url, function(img) {
            var texture = cib ? new THREE.CanvasTexture(img) : new THREE.Texture(img);
            texture.needsUpdate = true;
            Tour.mesh.material[id].map = texture;
            Tour.needsUpdate = true;
        }, null, function() {
            UI.notification.show(Lang.get('notification.error-load-img'));
        });
    }
};
