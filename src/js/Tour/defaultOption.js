/* globals Tour */

Tour.defaultOption = {
    path: 'panorams/',
    mainifest: 'manifest.json',
    tileset: [1, 3, 4, 5, 0, 2],
    rendererType: 'webgl',
    limit: {
        fov: { min: 20, max: 90},
        lat: { min: -85, max: 85}
    }
};
