/* globals Tour */

Tour.sentry = function() {
    var script = document.createElement('script');
    script.src = 'https://browser.sentry-cdn.com/4.2.2/bundle.min.js';
    script.crossorigin = 'anonymous';
    document.getElementsByTagName('head')[0].appendChild(script);

    script.onload = function() {
        Sentry.init(Tour.options.sentry);
    };
};
