/* globals UI */

UI.layout = {
    active: false
};

UI.layout.init = function(domElement) {
    domElement.addEventListener('mousemove', function(){
        this.active = false;
    }.bind(this), false);
}

UI.layout.setActive = function(value) {
    this.active = value || this.active;
}

UI.layout.applyActive = function(value) {
    document.body.classList[(value && this.active)?'add':'remove']('active');
}