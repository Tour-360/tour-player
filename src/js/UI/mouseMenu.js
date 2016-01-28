/* globals UI */

UI.mouseMenu = {};

UI.mouseMenu.init = function() {
    this.domElement = document.createElement('div');
    this.domElement.id = 'mouse-menu';
    this.domElement.addEventListener('selectstart', function() {
        event.preventDefault();
    });
    document.body.appendChild(this.domElement);

    document.addEventListener('contextmenu', function(event) {
        UI.mouseMenu.open(event);
        event.preventDefault();
    });

    this.domElement.addEventListener('mousedown', function(event) {
        event.stopPropagation();
    });
    document.addEventListener('mousedown', function() {
        UI.mouseMenu.close();
    }.bind(UI));
};

UI.mouseMenu.setPosition = function(x, y) {
    this.domElement.style.left = x + 'px';
    this.domElement.style.top = y + 'px';
};

UI.mouseMenu.open = function(event) {
    this.domElement.classList.add('visible');
    if (event) {
        var margin = 5;
        var x = event.clientX;
        var y = event.clientY - margin;
        var height = UI.mouseMenu.domElement.clientHeight;
        var width  = UI.mouseMenu.domElement.clientWidth;

        if (event.clientX + width > window.innerWidth) {
            x = event.clientX - width;
        }

        if (event.clientY + height > window.innerHeight) {
            y = event.clientY - height + margin;
        }

        this.setPosition(x, y);
    }
};

UI.mouseMenu.close = function() {
    this.domElement.classList.remove('visible');
};

UI.mouseMenu.Item = function(action, title, key) {
    this.titleElement = document.createElement('span');
    this.titleElement.classList.add('title');
    this.titleElement.textContent = title;
    this.action = action;

    this.keyElement = document.createElement('span');
    this.keyElement.classList.add('key');
    this.keyElement.textContent = key || '';

    this.domElement = document.createElement('div');
    this.domElement.classList.add('item');
    this.disabled = false;

    this.domElement.appendChild(this.titleElement);
    this.domElement.appendChild(this.keyElement);

    var onselect = function(event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.disabled && this.action) {
            this.action();
            UI.mouseMenu.close();
        }
    };

    this.domElement.addEventListener('click', onselect.bind(this));
    this.domElement.addEventListener('contextmenu', onselect.bind(this));
    UI.mouseMenu.domElement.appendChild(this.domElement);
};

UI.mouseMenu.Item.prototype.setDisable = function(type) {
    this.disabled = type;
    this.domElement.classList[type ? 'add' : 'remove']('disabled');
};

UI.mouseMenu.Item.prototype.setVisible = function(type) {
    this.visible = type;
    this.domElement.classList[type ? 'remove' : 'add']('hidden');
};

UI.mouseMenu.Item.prototype.setText = function(title, key) {
    if (title) {
        this.titleElement.textContent = title;
    }
    if (key) {
        this.keyElement.textContent = key;
    }
};

UI.mouseMenu.Hr = function() {
    this.domElement = document.createElement('hr');
    UI.mouseMenu.domElement.appendChild(this.domElement);
};

