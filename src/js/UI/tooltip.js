/* globals Tour, UI */

UI.tooltip = {
    init: function() {
        this.domElement = document.createElement('div');
        this.domElement.id = 'tooltip';
        Tour.domElement.appendChild(this.domElement);
    },

    setTitle: function(text) {
        this.domElement.innerText = text;
    },

    setPosition: function(x, y) {
        this.domElement.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    },

    setVisible: function(value) {
        this.domElement.style.visibility = (value)?'visible':'hidden';
    }
};
