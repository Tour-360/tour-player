/* globals UI */

UI.notification = {
    init: function() {
        this.domElement = document.createElement('div');
        this.domElement.id = 'notification';

        this.textDomElement = document.createElement('span');

        this.domElement.appendChild(this.textDomElement);
        document.body.appendChild(this.domElement);
    },
    setVisible: function(type) {
        if (type) {
            this.domElement.classList.add('visible');
        } else {
            this.domElement.classList.remove('visible');
        }
    },
    setText: function(text) {
        this.textDomElement.innerText = text;
    },
    show: function(text, duration) {
        this.setText(text);
        this.setVisible(true);
        if (this.setInterval) {
            clearTimeout(this.setInterval);
        }
        if (duration !== false) {
            this.setInterval = setTimeout(function() {
                this.setVisible(false);
            }.bind(this), duration || 2000);
        }
    }
};
