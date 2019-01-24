/* globals Tour */

Tour.sentry = function() {
    var script = document.createElement('script');
    script.src = 'https://browser.sentry-cdn.com/4.2.2/bundle.min.js';
    script.crossorigin = 'anonymous';
    document.head.appendChild(script);

    script.onload = function() {
        Sentry.init(Tour.options.sentry);
        Sentry.configureScope(function(scope) {
            scope.setTag('player.version', Tour.version.join('.'));
            scope.setTag('player.renderer', Tour.options.rendererType);
            scope.setTag('player.gallery', Tour.options.gallery);
            scope.setTag('player.mouseMenu', Tour.options.mouseMenu);
            scope.setTag('player.controlPanel', Tour.options.controlPanel);
        });
    };
};
