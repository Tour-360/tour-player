importScripts('jpg.js');

onmessage = function(event) {
    var image = new JpegImage();
    image.onload = function() {
        var imageData = new ImageData(image.width, image.height);
        image.copyToImageData(imageData);
        postMessage(event.data);
        postMessage(imageData);
    };
    image.load(event.data);
};