/* globals UI */

UI.Slider = function(domElement) {
    this.frame = 0;
    this.domElement = domElement;
    this.popupId = this.domElement.parentNode.id;
    this.images = this.domElement.getElementsByTagName('img');
    this.length = this.images.length;

    this.tape = document.createElement('div');
    this.tape.className = 'tape';

    this.prevButton = new this.SliderButton(this, 'prev');
    this.nextButton = new this.SliderButton(this, 'next');

    while (this.images.length) {
        this.tape.appendChild(this.images[0]);
    }
    this.images = this.tape.getElementsByTagName('img');

    this.setPosition(0);
    this.domElement.appendChild(this.tape);

    document.addEventListener('keydown', function(event) {
        if (this.popupId == location.hash.slice(1)) {
            switch (event.key) {
                case 'ArrowLeft': this.move(-1); event.stopImmediatePropagation(); break;
                case 'ArrowRight': this.move(1); event.stopImmediatePropagation(); break;
            }
        }
    }.bind(this), false);
};

UI.Slider.prototype.setPosition = function(n) {
    if (typeof n == 'number') {
        this.frame = Math.max(0, Math.min(this.length - 1, n));
    }
    this.images[this.frame].onload = this.setPosition.bind(this);
    this.tape.style.transform = 'translateX(' + (this.frame * -100) + '%)';
    var height = this.images[this.frame].getBoundingClientRect().height;
    if (height > 100) { this.tape.style.height = height + 'px'; }
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
