/* globals UI */

UI.popUp = {
    init: function() {
        this.domElement = document.querySelector('.popup-layout');
        if (this.domElement) {
            this.domElement.addEventListener('click', function(event) {
                if (event.target == this.domElement) {
                    this.set();
                }
            }.bind(this));
            this.closeElement = document.querySelector('.popup-layout .close');
            this.closeElement.addEventListener('click', this.set.bind(this, false));
            window.addEventListener('popstate', this.popstate.bind(this));
            this.popstate();
        }
    },
    set: function(id) {
        var scrollY = window.parent.scrollY;
        var scrollTop = window.parent.document.body.scrollTop;

        window.location.hash = id || '';

        window.parent.scrollY = scrollY;
        window.parent.document.body.scrollTop = scrollTop; // issues #250

        setTimeout(function() {window.scroll(0,0);}, 0); // issues #226
    },
    popstate: function() {
        this.domElement.classList[window.location.hash ? 'add' : 'remove']('visible');
    }
};
