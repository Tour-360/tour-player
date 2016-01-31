/* globals Tour */

/**
 * Переключает тур на указанную панораму
 *
 * @param {Number} id идентификатор панорамы
 */
Tour.setPanorama = function(id) {
    if (this.options.rendererType != 'css' && this.options.transition) {

        var imageUrl = this.mesh.material.materials[0].map.image ?
            this.renderer.domElement.toDataURL('image/jpeg') : this.data.backgroundImage;

        this.backgroundImage.set(
            imageUrl,
            this.data.backgroundColor,
            function() {
                this.data.backgroundImage = false;
                document.body.classList.add('transition');
                this.setTexture(id);
                this.setMarkers();
            }.bind(this)
        );
    } else {
        this.setTexture(id);
        this.setMarkers();
    }
};
