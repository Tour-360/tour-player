/* globals UI */

UI.notification = {
    init: function() {
        this.domElement = document.createElement('div');
        this.domElement.id = 'notification';

        this.textDomElement = document.createElement('span');

        this.domElement.appendChild(this.textDomElement);
        document.body.appendChild(this.domElement);
        this.setVisible(false);
    },
    setVisible: function(type) {
        if (type) {
            this.domElement.classList.add('visible');
            this.domElement.classList.remove('hidden');
        } else {
            this.domElement.classList.remove('visible');
            setTimeout(function() {
                this.domElement.classList.add('hidden');
            }.bind(this), 300); // 300 - Длительность анимации скрытия уведомления
        }
    },
    setText: function(text) {
        this.textDomElement.innerText = text;
    },
    show: function(text, duration) {
        this.setText(text);
        this.setVisible(true);
        if (this.setTimeout) {
            clearTimeout(this.setTimeout);
        }
        if (duration !== false) {
            this.setTimeout = setTimeout(function() {
                this.setVisible(false);
            }.bind(this), duration || 2000);
        }
    }
};
