/* globals UI */

UI.Slider = function(domElement) {
    this.frame = 0;
    this.domElement = domElement;
    this.popupId = this.domElement.parentNode.id;
    this.images = this.domElement.getElementsByTagName('img');
    this.length = this.images.length;

    this.tape = document.createElement('div');
    this.tape.className = 'tape';

    while (this.images.length) {
        this.tape.appendChild(this.images[0]);
    }
    this.images = this.tape.getElementsByTagName('img');

    this.prevButton = new this.SliderButton(this, 'prev');
    this.nextButton = new this.SliderButton(this, 'next');

    if (Tour.options.sliderBullets) {
        this.bulletsElement = document.createElement('div');
        this.bulletsElement.classList.add('bullets');
        this.domElement.appendChild(this.bulletsElement);

        for (var i = 0; i < this.images.length; i++) {
            var bullet = document.createElement('div');
            bullet.classList.add('bullet');
            bullet.addEventListener('click', function(i) {
                this.setPosition(i, true);
            }.bind(this, i), false);
            this.bulletsElement.appendChild(bullet);
        }

        if (Tour.options.sliderAutoNextFrameInterval) {
            this.autoNextInterval = setInterval(this.next.bind(this), Tour.options.sliderAutoNextFrameInterval);
        }
    }

    this.setPosition(0);
    this.domElement.appendChild(this.tape);

    document.addEventListener('keydown', function(event) {
        if (this.popupId == location.hash.slice(1)) {
            switch (event.key) {
                case 'ArrowLeft': this.move(-1, true); event.stopImmediatePropagation(); break;
                case 'ArrowRight': this.move(1, true); event.stopImmediatePropagation(); break;
            }
        }
    }.bind(this), false);
};

UI.Slider.prototype.setPosition = function(n, userEvent) {
    if (userEvent) {
        clearInterval(this.autoNextInterval);
    }
    if (typeof n == 'number') {
        this.frame = Math.max(0, Math.min(this.length - 1, n));
    }
    this.tape.style.transform = 'translateX(' + (this.frame * -100) + '%)';
    if (this.images) { this.images = this.tape.getElementsByTagName('img');} // IE
    this.images[this.frame].onload = this.setPosition.bind(this);
    var height = this.images[this.frame].clientHeight;
    if (height > 100) { this.tape.style.height = height + 'px'; }
    this.prevButton.setVisible(this.frame > 0);
    this.nextButton.setVisible(this.frame < this.length - 1);

    if (this.bulletsElement) {
        for (var i = 0; i < this.images.length; i++) {
            this.bulletsElement.children[i].classList[this.frame == i ? 'add' : 'remove']('select');
        }
    }
};

UI.Slider.prototype.move = function(n, userEvent) {
    this.setPosition(this.frame += n, userEvent);
};

UI.Slider.prototype.next = function() {
    if (window.location.hash.substr(1) == this.popupId) {
        this.frame = ++this.frame % this.images.length;
        this.setPosition(this.frame);
    }
};

UI.Slider.prototype.SliderButton = function(slider, type) {
    this.slider = slider;
    this.domElement = document.createElement('div');
    this.domElement.classList.add('slider-button', type);
    this.domElement.classList.add(type);
    this.domElement.addEventListener('click', function() {
        this.move(type == 'next' ? 1 : -1, true);
    }.bind(this.slider), false);
    this.slider.domElement.appendChild(this.domElement);
};

UI.Slider.prototype.SliderButton.prototype.setVisible = function(v) {
    this.domElement.classList[v ? 'remove' : 'add']('hidden');
};
