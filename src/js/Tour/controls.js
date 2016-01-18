/* globals Tour, UI*/

Tour.controls = {
    back: function() {
        window.history.back();
    },

    forward: function() {
        window.history.forward();
    },

    fullscreen: function() {
        var e;
        if (document.fullscreenElement              ||
            document.msFullscreenElement            ||
            document.webkitCurrentFullScreenElement ||
            document.mozFullScreenElemenz
        ) {
            e = document;
            if (e.exitFullscreen) { e.exitFullscreen();
            } else if (e.msExitFullscreen) { e.msExitFullscreen();
            } else if (e.webkitCancelFullScreen) { e.webkitCancelFullScreen();
            } else if (e.mozCancelFullScreen) { e.mozCancelFullScreen(); }
        } else {
            e = document.documentElement;
            if (e.requestFullscreen) { e.requestFullscreen();
            } else if (e.msRequestFullscreen) { e.msRequestFullscreen();
            } else if (e.webkitRequestFullScreen) { e.webkitRequestFullScreen();
            } else if (e.mozRequestFullScreen) { e.mozRequestFullScreen(); }
        }
    },

    visitSite: function() {
        window.open('http://tour-360.ru', '_blank');
    },

    download: function() {
        var link = document.createElement('a');
        link.href = Tour.renderer.domElement.toDataURL('image/jpeg');
        link.download = document.title + '.jpg';
        link.click();
    },

    autoRotate: function() {
        Tour.view.rotation.auto = !Tour.view.rotation.auto;
    },

    reload: function() {
        location.reload();
    },

    hideMenu: function() {
        UI.controlPanel.setVisible();
    },

    zoomIn: function() {
        Tour.view.fov.move(-10);
        Tour.history.set();
    },

    zoomOut: function() {
        Tour.view.fov.move(10);
        Tour.history.set();
    },

    moveUp: function() {
        Tour.view.lat.move(30);
        Tour.history.set();
    },

    moveDown: function() {
        Tour.view.lat.move(-30);
        Tour.history.set();
    },

    moveRight: function() {
        Tour.view.lon.move(22.5);
        Tour.history.set();
    },

    moveLeft: function() {
        Tour.view.lon.move(-22.5);
        Tour.history.set();
    },

    getCode: function() {

    },

    editor: function() {

    },

    suport: function() {

    },

    help: function(event) {
        event.preventDefault();
        var page = 'Помощь-в-пользовании-плеером-виртуальных-туров';
        window.open('http://github.com/Tour-360/tour-player/wiki/' + page, '_blank');
    },

    badBrowser: function() {
        Tour.log('bad browser'); //!!
    }
};
