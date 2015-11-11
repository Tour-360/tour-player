/* globals Tour */

Tour.animate = function() {
    requestAnimationFrame(Tour.animate);
    Tour.render();
};
