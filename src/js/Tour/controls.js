/* globals Tour, UI, Lang, BrouserInfo*/

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

    stopRotate: function() {
        Tour.view.rotation.auto = false;
        Tour.view.rotation.lat = Tour.view.rotation.lon = 0;
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
        Tour.controls.stopRotate();
        Tour.view.lat.move(30);
        Tour.history.set();
    },

    moveDown: function() {
        Tour.controls.stopRotate();
        Tour.view.lat.move(-30);
        Tour.history.set();
    },

    moveRight: function() {
        Tour.controls.stopRotate();
        Tour.view.lon.move(-22.5);
        Tour.history.set();
    },

    moveLeft: function() {
        Tour.controls.stopRotate();
        Tour.view.lon.move(22.5);
        Tour.history.set();
    },

    getCode: function() {
        var code = '<iframe src="' + location.href +
        '" width="640" height="480" frameborder="no" scrolling="no" allowfullscreen></iframe>';

        var report = function(done) {
            if (done) {
                UI.notification.show(Lang.get('notification.successfully-copied'));
            } else {
                var metaKey = BrouserInfo.apple ? '⌘' : 'Ctrl';
                window.prompt(Lang.get('notification.embed-code').replace('*', metaKey + '+C'), code);
            }
        };

        if (document.execCommand) {
            var span = document.createElement('span');
            span.textContent = code;
            document.body.appendChild(span);
            var range = document.createRange();
            range.selectNode(span);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);

            report(document.execCommand('copy'));

            window.getSelection().removeAllRanges();
            document.body.removeChild(span);
        } else if (window.clipboardData) {
            window.clipboardData.setData('Text', code);
            report(true);
        } else {
            report(false);
        }
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

    }
};
