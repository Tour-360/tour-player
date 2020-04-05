/* globals Tour, UI, Lang, BrouserInfo, Tools*/

Tour.controls = {
    back: function() {
        window.history.back();
    },

    forward: function() {
        window.history.forward();
    },

    next: function() {
        Tour.view.go(1);
    },

    previous: function() {
        Tour.view.go(-1);
    },

    opennewtab: function() {
        window.open(location.href,'_blank');
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

            if (screen.orientation && screen.orientation.unlock) {
                screen.orientation.unlock();
            }
        } else {
            e = document.documentElement;
            if (e.requestFullscreen) { e.requestFullscreen();
            } else if (e.msRequestFullscreen) { e.msRequestFullscreen();
            } else if (e.webkitRequestFullScreen) { e.webkitRequestFullScreen();
            } else if (e.mozRequestFullScreen) { e.mozRequestFullScreen(); }

            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock(screen.orientation.type).catch(function() {
                    // Блокировка поворота экрана недоступна для этого устройства
                });
            }
        }
    },

    visitSite: function() {
        window.open('http://tour-360.ru', '_blank');
    },

    download: function() {
        var type = 'image/jpeg';
        var quality = .95;

        function save(url) {
            var link = document.createElement('a');
            link.href = url;
            link.download = document.title + '.jpg';
            link.dispatchEvent(new MouseEvent('click'));
        }

        if (Tour.renderer.domElement.toBlob) {
            Tour.renderer.domElement.toBlob(function(blob) {
                save(URL.createObjectURL(blob));
            }, type, quality);
        } else if (Tour.renderer.domElement) {
            save(Tour.renderer.domElement.toDataURL(type, quality));
        }
    },

    /**
     * Парсит location.search
     *
     * @param {Number} timeout Интервал, на который откладывается автовращение
     *                         30000     — Будет отложенно на 30 секунд
     *                         true      — Будет отложенно на время поумолчанию
     *                         false     — Будет удален интервал
     *                         undefined — Будет запущен мгновенно
     */

    autoRotate: function(timeout) {
        clearInterval(this.autorotateTimeout);
        if (timeout) {
            if (timeout === true) {
                timeout = Tour.options.autorotationTimeout;
            }
            if (timeout) {
                this.autorotateTimeout = setTimeout(this.autoRotate.bind(this), timeout);
            }
        } else if (timeout === 0 || timeout === false) {
            Tour.view.rotation.auto = false;
        } else if (timeout === undefined) {
            Tour.view.rotation.auto = !Tour.view.rotation.auto;
        }
    },

    reload: function() {
        location.reload(true);
    },

    toggleMenu: function() {
        var panel = UI.controlPanel;
        panel.setVisible(!panel.visibility);
        if (Tour.toggleMenuItem) {
            var text = Lang.get('mousemenu.' + (panel.visibility ? 'hide' : 'show') + 'menu');
            Tour.toggleMenuItem.setText(text);
        }
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

    toggleControls: function() {
        if (window.isSecureContext) {
            var ctrl = Tour.orientationControls.controls;
            ctrl.enabled ? ctrl.disconnect() : ctrl.connect();
        }
    },

    getCode: function() {
        var allow = ['accelerometer', 'autoplay', 'gyroscope'];
        var code = '<iframe src="' + location.href +
        '" width="640" height="480" frameborder="no" scrolling="no" allow="' + allow.join('; ') +
        '" allowfullscreen></iframe>';
        Tour.controls.copyText(code);
    },

    copyText: function(text) {
        var report = function(done) {
            if (done) {
                UI.notification.show(Lang.get('notification.successfully-copied'));
            } else {
                var metaKey = BrouserInfo.apple ? '⌘' : 'Ctrl';
                window.prompt(Lang.get('notification.embed-code').replace('*', metaKey + '+C'), text);
            }
        };

        if (document.execCommand) {
            var span = document.createElement('span');
            span.textContent = text;
            document.body.appendChild(span);
            var range = document.createRange();
            range.selectNode(span);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);

            report(document.execCommand('copy'));

            window.getSelection().removeAllRanges();
            document.body.removeChild(span);
        } else if (window.clipboardData) {
            window.clipboardData.setData('Text', text);
            report(true);
        } else {
            report(false);
        }
    },

    editor: function() {
        Tools.init();
    },

    suport: function() {

    },

    help: function(event) {
        event.preventDefault();
        var page = 'Помощь-в-пользовании-плеером-виртуальных-туров';
        window.open('http://github.com/Tour-360/tour-player/wiki/' + page, '_blank');
    },

    badBrowser: function() {

    },

    closeWindow: function() {
        UI.popUp.set();
    }
};
