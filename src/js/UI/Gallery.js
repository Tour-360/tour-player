/* globals UI */

UI.gallery = {
    init: function() {
        this.visible = false;
        this.domElement = document.createElement('div');
        this.domElement.id = 'gallery';
        this.ul = document.createElement('ul');
        this.toggler = document.createElement('div');
        this.toggler.classList.add('gallery-toggler');
        console.log(UI.gallery.toggler);
        this.toggler.addEventListener('click', this.toggle.bind(this));
        this.domElement.appendChild(this.toggler);
        this.domElement.appendChild(this.ul);
        document.body.appendChild(this.domElement);

        this.display(true);
    },
    toggle: function(){
        this.display(!this.visible);
    },
    display: function(visible){
        this.visible = visible;
        if (visible) {
            this.onOpen && this.onOpen();
        } else {
            this.onClose && this.onClose();
        }
        this.domElement.classList[visible ? 'add' : 'remove']('visible');
    },
    addItem: function() {
        this.item = document.createElement('li');
        this.item.style.backgroundImage = 'url(http://unsplash.it/200/200?random=' + options.title + ')';

        if(options.title) {
            this.titleElem = document.createElement('div');
            this.titleElem.classList.add('item-title');
            this.titleElem.innerText = options.title;
            this.titleElem.title = options.title;
            this.item.appendChild(this.titleElem);
        }

        this.ul.appendChild(this.item);
    },
    setVisible: function(type) {

    }
};
