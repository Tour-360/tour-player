/* globals Tour */

Tour.load = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url || 'data.json', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) {
            return;
        }
        if (xhr.status != 200) {
            Tour.log('Tour load Error');
        } else {
            try {
                Tour.data = JSON.parse(xhr.responseText);
                Tour.emmit('load', Tour.data);
            } catch (e) {
                Tour.log('JSON Error');
            }
            return true;
        }
    };
    xhr.send();
};
