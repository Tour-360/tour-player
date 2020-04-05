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
            window.addEventListener('hashchange', this.popstate.bind(this));
            this.popstate();
        }
    },
    set: function(id) {
        var canAccessIFrame = !!~Object.keys(window.parent.location).indexOf('host');
        if (canAccessIFrame) {
            var scrollY = window.parent.scrollY;
            var scrollX = window.parent.scrollX;
        }

        window.location.hash = id || '';

        if (canAccessIFrame) {
            setTimeout(function() {
                window.parent.scrollTo(scrollX, scrollY);
            }, 0);
        }

        setTimeout(function() {
            window.scroll(0,0);
        }, 0); // issues #226
    },

    popstate: function() {
        var hash = window.location.hash.length > 1;
        this.domElement.classList[hash ? 'add' : 'remove']('visible');
    }
};
