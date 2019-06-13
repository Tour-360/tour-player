/* globals Tour, Lang, UI */

Tour.setSliders = function() {
    var sliders = document.querySelectorAll('.slider');
    this.sliders = [];
    for (var i = 0; i < sliders.length; i++) {
        this.sliders.push(new UI.Slider(sliders[i]));
    }
};
