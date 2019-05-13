/* globals UI */

UI.slider = {
    init: function() {
        var currentSlide = 0;

        function Button(slider, type, onClick) {
            this.domElement = document.createElement('div');
            this.domElement.classList.add('slider-button', type);
            this.domElement.onClick = onClick;
            slider.appendChild(this.domElement);
            this.domElement.addEventListener('click', onClick);

            this.setVisible = function(t) {
                this.domElement.classList[t ? 'remove' : 'add']('hidden');
            };
        }

        this.domElements = document.querySelectorAll('.slider');
        Array.from(this.domElements).map(function(slider) {
            const images = slider.getElementsByTagName('img');
            const tape = document.createElement('div');
            tape.className = 'tape';

            function setPosition(n) {
                rightButton.setVisible(n != images.length - 1);
                leftButton.setVisible(n != 0);
                tape.style.transform = 'translateX(' + (n * -100) + '%)';
            };

            const leftButton = new Button(slider, 'prev', function() {
                setPosition(--currentSlide);
            });

            const rightButton = new Button(slider, 'next', function() {
                setPosition(++currentSlide);
            });

            setPosition(0);

            Array.from(images).map(function(image) {
                const newImage = image.cloneNode();
                tape.appendChild(newImage);
                image.remove();
            });

            slider.appendChild(tape);
        });
    }
};
