/* globals Tour */

/**
 * Создает на странице видео элементы
 *
 * @param {Number} videos Объект описания видео
 */
Tour.setVideos = function(videos) {
    this.videos = {};
    if (videos) {
        for (var i = 0; i < videos.length; i++) {
            this.videos[videos[i].id] = new Tour.Video(videos[i]);
        }
    }
};

// TODO: Вынести и переписать на map
Tour.setImages = function(images) {
    this.images = {};
    if (images) {
        for (var i = 0; i < images.length; i++) {
            this.images[images[i].id] = new Tour.Image(images[i]);
        }
    }
};
