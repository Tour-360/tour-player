/* globals Tour */

Tour.defaultOption = {
    path: 'panorams/',
    mainifest: 'manifest.json',
    tileset: [1, 3, 4, 5, 0, 2],
    kineticRotateSpeed: 0.1,
    autorotationSpeed: -0.5,
    transition: true,
    mouseMenu: true,
    controlPanel: false,
    scaleControl: true,
    limit: {
        fov: { min: 20, max: 90},
        lat: { min: -85, max: 85}
    }
};
