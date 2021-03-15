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
        if(Tour.decodeFactory.suported && true){
            var loader = new Tour.WorkerLoader(manager);
        }else if(window.createImageBitmap){
            var loader = new Tour.ImageBitmapLoader(manager)
        }else{
            var loader = new Tour.ImageLoader(manager)
        }
        loader.load(url, function(texture) {
            Tour.mesh.material[id].map = texture;
            Tour.mesh.material[id].needsUpdate = true;
            texture.needsUpdate = true; //?
            Tour.needsUpdate = true;
        }, null, function() {
            UI.notification.show(Lang.get('notification.error-load-img'));
        });
    }
};
