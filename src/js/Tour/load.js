/* globals Tour */

Tour.load = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url || Tour.options.mainifest, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) {
            return;
        }
        if (xhr.status != 200) {
            Tour.log('Tour load Error');
        } else {
            try {
                Tour.data = JSON.parse(xhr.responseText);
                callback(Tour.data);
                Tour.emmit('load', Tour.data);
            } catch (e) {
                Tour.log('JSON Error');
            }
        }
    };
    xhr.send();
};
