/* globals UI */

UI.layout = {
};

UI.layout.setActive = function(value) {
    Tour.domElement.classList[value? 'add' : 'remove']('active');
}
