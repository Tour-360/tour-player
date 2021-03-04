/* globals Tour */

var playerFolder = document.currentScript && (document.currentScript.src
  .split('/').slice(0,-1).join('/')) || "/";

Tour.defaultOption = {
  element: '#tour-player',
  plugins: [],
  path: 'panorams/',
  playerFolder: playerFolder,
  tools: playerFolder + '/tools/tool.html',
  pluginsFolder: playerFolder + '/plugins',
  manifest: 'tour.json',
  tileSet: [1, 3, 4, 5, 0, 2],
  initFov: 75,
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
  sliderBullets: true,
  sliderAutoNextFrameInterval: 0,
  nadirControl: true,
  nadirControlArrowFilter: 'links',
  hideInvisiblePoints: true,
  pointersOpacity: 0.6,
  arrowsDistance: 20,
  points: true,
  autoPoints: true,
  vibrate: true,
  arrowsTitle: false,
  pointsTitle: false,
  hintArea: false,
  sentry: {
    dsn: 'https://c3787e5f33b14319900ad46caabbaa6f@sentry.io/1309149'
  },
  limit: {
    fov: { min: 40, max: 90},
    lat: { min: -85, max: 85},
    lon: { min: false, max: false}
  }
};
