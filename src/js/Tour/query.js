/* globals Tour */

Tour.query = {};

/**
 * Парсит location.search
 *
 * @return {Object} Объект запросов
 */
Tour.query.get = function() {
    var search = location.search.slice(1).split('&');
    var queries = {};

    for (var i = 0; i < search.length; i++) {
        var querie = search[i].split('=');
        if (querie[0]) {
            queries[querie[0]] = querie[1];
        }
    }

    return queries;
};

Tour.query.set = function(values) {
    var query = [];
    for (var k in values) {
        query.push(k + '=' + values[k]);
    }
    return '?' + query.join('&');
};
