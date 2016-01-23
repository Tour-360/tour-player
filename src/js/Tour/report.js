/* globals Tour, BrouserInfo*/

Tour.report = function(event) {
    var img = new Image();
    img.src = '//tour-360.ru/report' +
    '?error_msg=' + event.error.name + ' ' + event.error.message +
    '&url=' + window.location.href +

    '&os=' + BrouserInfo.os.name +
    '&os_v=' + BrouserInfo.os.version +
    '&browser=' + BrouserInfo.brouser.name +
    '&browser_v=' + BrouserInfo.brouser.version +

    '&webgl=' + BrouserInfo.webgl +
    '&css=' + BrouserInfo.css +
    '&canvas=' + BrouserInfo.canvas +
    '&array=' + BrouserInfo.array +

    '&mobile=' + BrouserInfo.mobile +
    '&array=' + BrouserInfo.apple +

    '&screen=' + BrouserInfo.screenSize +
    '&renderer=' + Tour.options.rendererType;
};
