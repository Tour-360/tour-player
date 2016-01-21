/* globals Tour, UI, Lang */

Tour.load = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url || Tour.options.mainifest, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) {
            return;
        }
        if (xhr.status != 200) {
            UI.notification.show(Lang.get('notification.error-load-tour'), false);
        } else {
            try {
                Tour.data = JSON.parse(xhr.responseText);
                callback(Tour.data);
                Tour.emmit('load', Tour.data);
            } catch (e) {
                UI.notification.show('JSON ' + e.name + ' \n' + e.message, false);
            }
        }
    };
    xhr.send();
};
