/* globals Tour, UI, Lang */

Tour.load = function(data, callback) {
    if (typeof data === 'object') {
        this.data = data;
        callback(this.data);
        this.emmit('load', this.data);
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', data || Tour.options.mainifest, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) {
                return;
            }
            if (xhr.status != 200) {
                var errorText
                if(xhr.status == 0 || window.location.protocol == 'file:'){
                    errorText = Lang.get('notification.error-load-tour-protocol');
                }else{
                    errorText = Lang.get('notification.error-load-tour');
                }
                UI.notification.show(errorText, false);
            } else {
                try {
                    var json = xhr.responseText.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/mg, '');
                    Tour.data = JSON.parse(json);
                    callback(Tour.data);
                    Tour.emmit('load', Tour.data);
                } catch (e) {
                    var position = parseInt(e.message.split(' ')[7]);
                    if (position) {
                        var lines = xhr.responseText.split('\n');
                        for (var line = 0, bites = 0; bites <= position; line++) {
                            bites += lines[line].length + 1;
                        }
                    }
                    UI.notification.show(e.name + ' \n' + e.message + (line ? ' line ' + line : ''), false);
                }
            }
        };
        xhr.send();
    }
};
