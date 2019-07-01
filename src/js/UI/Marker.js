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
    this.domElement.addEventListener('mouseover', this.setTitlePosition.bind(this));
    this.visible = true;

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
    if (content) {
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
        this.titleDomElement.style.width = 'max-content';
        var newWidth = this.titleDomElement.clientWidth + 1;
        this.titleDomElement.style.width = newWidth + 'px';
        this.titleDomElement.style.marginLeft = -(newWidth / 2 - this.size / 2) + 'px';
        this.title = content;
    } else {
        return false;
    }
};

UI.Marker.prototype.setPosition = function(x, y, r) {
    this.x = x;
    this.y = y;
    if (this.x && this.y &&
        this.x > -this.size && this.y > -this.size &&
        this.x < window.innerWidth + this.size &&
        this.y < window.innerHeight + this.size) {
        this.domElement.style.transform = 'translate(' + this.x + 'px,' + this.y + 'px) ' +
            'rotate(' + r + 'deg)';
        this.setVisible(true);
    } else {
        this.setVisible(false);
    }

};

UI.Marker.prototype.setTitlePosition = function() {
    var offset = 100;
    if (this.title) {
        var direction = 'bottom';
        if (this.x > window.innerWidth - offset)         {direction = 'left';
        } else if (this.x < offset)                      {direction = 'right';
        } else if (this.y > window.innerHeight - offset) {direction = 'top';}

        if (direction == 'top' || direction == 'bottom') {
            this.titleDomElement.style.marginTop = '';
            this.titleDomElement.style.marginLeft = -(this.titleDomElement.clientWidth / 2 - this.size / 2) + 'px';
        } else {
            this.titleDomElement.style.marginLeft = '';
            this.titleDomElement.style.marginTop =
            -(this.titleDomElement.children[0].clientHeight / 2 - this.size / 2) + 'px';
        }
        this.titleDomElement.className = 'title ' + direction;
    }
};

UI.Marker.prototype.setVisible = function(type) {
    if (this.visible != type) {
        this.domElement.style.visibility = type ? 'visible' : 'hidden';
        this.visible = type;
    }
};

UI.Marker.prototype.setIcon = function(name) {
    if (name) {
        this.icon = name;
        this.buttonDomElement.className = 'button';
        this.buttonDomElement.classList.add(name);
    }
};

UI.Marker.prototype.remove = function() {
    this.domElement.parentNode.removeChild(this.domElement);
};
