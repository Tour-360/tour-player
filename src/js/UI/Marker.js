/* globals UI */

UI.Marker = function(action, icon, title) {
    var markersContayner = document.getElementById('markers');
    if (!markersContayner) {
        markersContayner = document.createElement('div');
        markersContayner.id = 'markers';
        document.body.appendChild(markersContayner);
    }

    this.buttonDomElement = document.createElement('div');
    this.buttonDomElement.classList.add('button');
    this.buttonDomElement.addEventListener('click', action);

    this.domElement = document.createElement('div');
    this.domElement.classList.add('marker');
    this.domElement.appendChild(this.buttonDomElement);

    markersContayner.appendChild(this.domElement);
    this.size = this.domElement.clientWidth;

    if (icon) {
        this.setIcon(icon);
    }
    if (title) {
        this.setTitle(title);
    }

    this.setPosition();
};

UI.Marker.prototype.setTitle = function(content) {
    var span;
    if (!this.title) {
        span = document.createElement('span');
        span.innerHTML = content;
        var title = document.createElement('div');
        title.classList.add('title');
        title.appendChild(span);
        this.domElement.appendChild(title);
        this.titleDomElement = title;
    }
    span = this.titleDomElement.children[0];
    span.innerHTML = content;
    this.titleDomElement.style.width = span.clientWidth + 1 + 'px';
    this.title = content;
};

UI.Marker.prototype.setPosition = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.domElement.style.left = this.x + 'px';
    this.domElement.style.top = this.y + 'px';

    /* Проверка и установка направления title (нужно вынести в отдельный метод) */
    if (this.title) {
        this.titleDomElement.className = 'title';

        var direction = 'bottom';

        if (this.y > window.innerHeight - 200) {direction = 'top';}
        if (this.x > window.innerWidth - 200)  {direction = 'left';}
        if (this.x < 200)                      {direction = 'right';}
        if (this.y < 200)                      {direction = 'bottom';}

        if (direction == 'top' || direction == 'bottom') {
            this.titleDomElement.style.marginLeft = -(this.titleDomElement.clientWidth / 2 - this.size / 2) + 'px';
        } else {
            this.titleDomElement.style.marginLeft = '';
            this.titleDomElement.style.marginTop =
            -(this.titleDomElement.children[0].clientHeight / 2 - this.size / 2) + 'px';
        }
        this.titleDomElement.classList.add(direction);
    }
};

UI.Marker.prototype.setVisible = function(type) {
    this.domElement.style.display = type ? 'block' : 'none';
};

UI.Marker.prototype.setIcon = function(name) {
    this.icon = name;
    this.buttonDomElement.className = 'button';
    this.buttonDomElement.classList.add(name);
};
