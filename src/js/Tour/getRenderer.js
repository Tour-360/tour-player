/* globals Tour, BrouserInfo*/

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
