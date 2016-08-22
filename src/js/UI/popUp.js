/* globals UI */

UI.popUp = {
    init: function() {
        this.domElement = document.querySelector('.popup-layout');
        this.domElement.addEventListener('click', function(event) {
            if (event.target == this.domElement) {
                this.hide();
            }
        }.bind(this));
        this.closeElement = document.querySelector('.popup-layout .close');
        this.closeElement.addEventListener('click', this.hide.bind(this));
    },
    show: function(id) {
        window.location.hash = id;
        this.domElement.classList.add('visible');
    },
    hide: function() {
        this.domElement.classList.remove('visible');
    }
};
