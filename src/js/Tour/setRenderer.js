/* globals Tour, THREE, BrouserInfo*/

/**
 * Устанавливет указанный тип редеринга,
 * если тип неуказан, подбирает подходящий.
 * если не одна из технологий не поддерживается,
 * предлогает обновить браузер.
 *
 * @param {String} rendererType тип рендерига ('webgl', 'css', 'canvas')
 * @param {String} imageType размер изображения ('webgl', 'css', 'canvas')
 */
Tour.setRenderer = function(rendererType, imageType) {
    this.options.rendererType = rendererType || this.getRenderer();
    this.options.imageType = imageType || (BrouserInfo.mobile || this.rendererType == 'canvas') ? 'low' : 'standard';

    if (this.options.rendererType == 'webgl') {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    } else if (this.options.rendererType == 'css') {
        this.renderer = new THREE.CSS3DRenderer();
    } else if (this.options.rendererType == 'canvas') {
        this.renderer = new THREE.CanvasRenderer();
    } else {
        this.controls.badBrouser();
        return false;
    }

    this.renderer.domElement.id = 'renderer';
};
