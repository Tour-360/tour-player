/* globals UI */

UI.Slider = function(domElement) {
    this.frame = 0;
    this.domElement = domElement;
    this.images = this.domElement.getElementsByTagName('img');
    this.length = this.images.length;

    this.tape = document.createElement('div');
    this.tape.className = 'tape';

    this.prevButton = new this.SliderButton(this, 'prev');
    this.nextButton = new this.SliderButton(this, 'next');

    while (this.images.length) {
        this.tape.appendChild(this.images[0]);
    }

    this.setPosition(0);
    this.domElement.appendChild(this.tape);
};

UI.Slider.prototype.setPosition = function(n) {
    this.frame = Math.max(0, Math.min(this.length - 1, n));
    this.tape.style.transform = 'translateX(' + (this.frame * -100) + '%)';
    this.prevButton.setVisible(this.frame > 0);
    this.nextButton.setVisible(this.frame < this.length - 1);
};

UI.Slider.prototype.move = function(n) {
    this.setPosition(this.frame += n);
};

UI.Slider.prototype.SliderButton = function(slider, type) {
    this.slider = slider;
    this.domElement = document.createElement('div');
    this.domElement.classList.add('slider-button', type);
    this.domElement.addEventListener('click', function() {
        this.slider.move(type == 'next' ? 1 : -1);
    }.bind(this), false);
    this.slider.domElement.appendChild(this.domElement);
};

UI.Slider.prototype.SliderButton.prototype.setVisible = function(v) {
    this.domElement.classList[v ? 'remove' : 'add']('hidden');
};
