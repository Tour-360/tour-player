/* globals Tour, UI */

UI.tooltip = {
    init: function() {
        this.domElement = document.createElement('div');
        this.domElement.id = 'tooltip';
        Tour.domElement.appendChild(this.domElement);
    },

    setTitle: function(text) {
        this.domElement.innerText = text;
    },

    render: function(renderer, options) {
        var title = renderer(options);
        UI.renderElement(this.domElement, title);
        return !!title;
    },

    renderTitleArea: function(area) {
      return area.title;
    },

    renderTitleArrow: function(arrow) {
      return Lang.translate(Tour.getPanorama(arrow.pano).title);
    },

    renderTitlePoint: function(point) {
      return Lang.translate(Tour.getPanorama(point.pano).title);
    },

    setPosition: function(x, y) {
        this.domElement.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    },

    setVisible: function(value) {
        this.domElement.style.visibility = (value)?'visible':'hidden';
    }
};
