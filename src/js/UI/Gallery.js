/* globals UI */

UI.gallery = {
    borderHoverSize: 5,
    init: function(visible) {
        this.visible = visible;
        this.domElement = document.createElement('div');
        this.domElement.id = 'gallery';
        this.ul = document.createElement('ul');
        this.toggler = document.createElement('div');
        this.toggler.classList.add('gallery-toggler');
        this.toggler.addEventListener('click', this.toggle.bind(this));
        this.domElement.appendChild(this.toggler);
        this.domElement.appendChild(this.ul);
        document.body.appendChild(this.domElement);

        this.items = {};

        this.display(visible);
    },
    toggle: function() {
        this.display(!this.visible);
    },
    display: function(visible) {
        this.visible = visible;
        if (visible) {
            this.onOpen && this.onOpen();
        } else {
            this.onClose && this.onClose();
        }
        this.domElement.classList[visible ? 'add' : 'remove']('visible');
    },
    addItem: function(options) {
        this.item = document.createElement('li');
        this.item.onclick = options.onclick;
        this.item.style.backgroundImage = 'url(' + options.image + ')';
        this.items[options.id] = this.item;
        if (options.title) {
            this.titleElem = document.createElement('div');
            this.titleElem.classList.add('item-title');
            this.titleElem.innerText = options.title;
            this.titleElem.title = options.title;
            this.item.appendChild(this.titleElem);
        }

        this.ul.appendChild(this.item);
    },

    setActive: function(id) {
        for (var k in this.items) {
            this.items[k].classList.remove('active');
        }

        if (this.items[id] && document.body.getBoundingClientRect) {
            this.items[id].classList.add('active');

            var itemRect = this.items[id].getBoundingClientRect();
            var ulRect = this.ul.getBoundingClientRect();

            if ((ulRect.height - itemRect.top) < 0 || (itemRect.top + itemRect.height) < 0) {
                var y = this.ul.scrollTop + this.items[id].getBoundingClientRect().y - this.borderHoverSize;
                this.ul.scrollTop = y;
            }
        }
    }
};
