/* globals Tour */

Tour.query = {};

// Объект запросов из location.search
Tour.queries = {};

/**
 * Парсит location.search
 *
 * @return {Object} Объект запросов
 */
Tour.query.get = function() {
    var search = location.search.slice(1).split('&');

    for (var i = 0; i < search.length; i++) {
        var querie = search[i].split('=');
        Tour.queries[querie[0]] = querie[1];
    }

    return Tour.queries;
};

Tour.query.set = function() {

};
