/* globals Tour, THREE, BrouserInfo*/

/**
 * Определяет поддерживаемый тип рендеринга,
 *
 * @return {String} тип рендерига ('webgl', 'css', 'canvas')
 */
Tour.getRenderer = function() {
    var rendererType;

    if (BrouserInfo.array) {
        if (BrouserInfo.webgl && !BrouserInfo.apple) {
            rendererType = 'webgl';
        } else if (BrouserInfo.css) {
            rendererType = 'css';
        } else if (BrouserInfo.canvas) {
            rendererType = 'canvas';
        }
    }

    return rendererType;
};

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
    Tour.rendererType = rendererType || this.getRenderer();
    Tour.imageType = imageType || (BrouserInfo.mobile || Tour.rendererType == 'canvas') ? 'low' : 'standard';

    if (Tour.rendererType == 'webgl') {
        Tour.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    } else if (Tour.rendererType == 'css') {
        Tour.renderer = new THREE.CSS3DRenderer();
    } else if (Tour.rendererType == 'canvas') {
        Tour.renderer = new THREE.CanvasRenderer();
    } else {
        Tour.badBrouser();
        return false;
    }

    Tour.renderer.domElement.id = 'renderer';
};
