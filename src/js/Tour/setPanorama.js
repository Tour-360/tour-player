/* globals Tour */

/**
 * Переключает тур на указанную панораму
 *
 * @param {Number} id идентификатор панорамы
 */
Tour.setPanorama = function(id) {

    var change = function(id) {
        this.setTexture(id);
        this.setMarkers(id);
        this.view.rotation.auto = this.data.panorams[id].autorotation !== false &&
            (this.data.panorams[id].autorotation || this.data.autorotation);
    };

    if (this.options.rendererType != 'css' && this.options.transition) {

        var imageUrl = this.mesh.material.materials[0].map.image ?
            this.renderer.domElement.toDataURL('image/jpeg') : this.data.backgroundImage;

        this.backgroundImage.set(
            imageUrl,
            this.data.backgroundColor,
            function() {
                this.data.backgroundImage = false;
                document.body.classList.add('transition');
                change.call(this, id);
            }.bind(this)
        );
    } else {
        change.call(this, id);
    }
};
