document.addEventListener('DOMContentLoaded', function() {
    var lazyImages = [].slice.call(document.querySelectorAll('img[data-src]'));

    if ('IntersectionObserver' in window) {
        var lazyImageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    delete lazyImage.dataset.src;
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        lazyImages.forEach(function(lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
            delete lazyImage.dataset.src;
        });
    }
});
