Tour.getRandomQuery = function() {
    if (!this.options.nocache) {
        return '';
    } else {
        return '?' + Math.floor(Math.random() * Math.pow(16,8)).toString(16);
    }
};
