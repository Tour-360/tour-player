/* globals Tour */

Tour.defaultOption = {
    path: 'panorams/',
    mainifest: 'manifest.json',
    tileset: [1, 3, 4, 5, 0, 2],
    fov: 75,
    kineticResistance: 1.1,
    autorotationSpeed: -0.05,
    autorotationTimeout: 0,
    mouseSensitivity: 10,
    touchDrag: true,
    transition: true,
    mouseMenu: true,
    controlPanel: false,
    touchScroll: false,
    scaleControl: true,
    iFrameScaleControl: false,
    autorotationAlign: true,
    sliderAutoNextFrameInterval: 6000,
    sentry: {
        dsn: 'https://c3787e5f33b14319900ad46caabbaa6f@sentry.io/1309149'
    },
    limit: {
        fov: { min: 20, max: 90},
        lat: { min: -85, max: 85},
        lon: { min: false, max: false}
    }
};
