/* globals UI */

UI.popUp = {
    init: function() {
        this.domElement = document.querySelector('.popup-layout');
        this.domElement.addEventListener('click', function(event) {
            if (event.target == this.domElement) {
                this.set();
            }
        }.bind(this));
        this.closeElement = document.querySelector('.popup-layout .close');
        this.closeElement.addEventListener('click', this.set.bind(this, false));
        window.addEventListener('popstate', this.popstate.bind(this));
        this.popstate();
    },
    set: function(id) {
        window.location.hash = id || '';
    },
    popstate: function() {
        this.domElement.classList[window.location.hash ? 'add' : 'remove']('visible');
    }
};
