UI.devCursor = {};
UI.devCursor.init = function(set) {
    if (set) {
        var cursor = document.createElement('div');
        cursor.classList.add('dev-cursor');
        document.body.appendChild(cursor);
    }
};
