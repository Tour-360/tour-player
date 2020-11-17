/* globals Tour, UI */

UI.devCursor = {};
UI.devCursor.init = function(set) {
    if (set) {
        var cursor = document.createElement('div');
        cursor.classList.add('dev-cursor');
        Tour.domElement.appendChild(cursor);
    }
};
