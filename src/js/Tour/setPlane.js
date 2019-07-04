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

        loadImage(url, function(e){
            var texture = new THREE.DataTexture(e, 2048, 2048, THREE.RGBFormat );
            texture.flipY = true;
                texture.needsUpdate = true;
                Tour.mesh.material[id].map = texture;
                Tour.needsUpdate = true;

        })

        // var loader = new Tour.ImageLoader(manager);
        // loader.load(url, function(img) {
        //     console.log(img)
        //     var texture = new THREE.Texture(img);
        //     texture.needsUpdate = true;
        //     Tour.mesh.material[id].map = texture;
        //     Tour.needsUpdate = true;
        // }, null, function() {
        //     UI.notification.show(Lang.get('notification.error-load-img'));
        // });
    }
};
