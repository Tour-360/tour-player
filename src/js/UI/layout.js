/* globals UI */

UI.layout = {
};

UI.layout.setActive = function(value) {
    document.body.classList[value? 'add' : 'remove']('active');
}