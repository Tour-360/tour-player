/* globals Tour */

Tour.query = {};

/**
 * Парсит location.search
 *
 * @return {Object} Объект запросов
 */

Tour.query.list = {};

Tour.query.get = function() {
    var search = location.search.slice(1).split('&');

    for (var i = 0; i < search.length; i++) {
        var querie = search[i].split('=');
        if (querie[0]) {
            if (querie[1] === undefined || querie[1] == 'true') {
                querie[1] = true;
            }
            if (querie[1] == 'false') {
                querie[1] = false;
            }
            this.list[querie[0]] = querie[1];
        }
    }
    return this.list;
};

Tour.query.set = function(values) {
    var query = [];
    for (var k in values) {
        this.list[k] = values[k];
    }
    for (var k in this.list) {
        query.push(this.list[k] !== true ? k + '=' + this.list[k] : k);
    }
    return '?' + query.join('&');
};
