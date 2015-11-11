var BrouserInfo;

BrouserInfo = function() {

    var screenSize = screen ? screen.width + ' x ' + screen.height : '';

    var isSupportedCanvas = function() {
        var canvas = document.createElement('canvas');
        return !!(canvas.getContext && canvas.getContext('2d'));
    };

    var isSupportedTransformWebGL = function() {
        try {
            var canvas = document.createElement('canvas');
            return !!window.WebGLRenderingContext &&
            !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    };

    var isSupportedTransformCSS = function() {
        var propertys = {
            'webkitTransformStyle': '-webkit-transform-style',
            'MozTransformStyle': '-moz-transform-style',
            'msTransformStyle': '-ms-transform-style',
            'transformStyle': 'transform-style'
        };

        var element = document.createElement('p');
        document.body.insertBefore(element, null);

        for (var k in propertys) {
            if (element.style[k] !== undefined) {
                element.style[k] = 'preserve-3d';
            }
        }

        var st = window.getComputedStyle(element, null);
        var transform;

        for (var n in propertys) {
            transform = st.getPropertyValue(propertys[n]) || transform;
        }

        document.body.removeChild(element);
        return transform == 'preserve-3d';
    };

    var detectOS = function() {
        var name = '-';
        var version  = '-';

        var clientStrings = [
        {s: 'Windows 3.11',        r: /Win16/},
        {s: 'Windows 95',          r: /(Windows 95|Win95|Windows_95)/},
        {s: 'Windows ME',          r: /(Win 9x 4.90|Windows ME)/},
        {s: 'Windows 98',          r: /(Windows 98|Win98)/},
        {s: 'Windows CE',          r: /Windows CE/},
        {s: 'Windows 2000',        r: /(Windows NT 5.0|Windows 2000)/},
        {s: 'Windows XP',          r: /(Windows NT 5.1|Windows XP)/},
        {s: 'Windows Server 2003', r: /Windows NT 5.2/},
        {s: 'Windows Vista',       r: /Windows NT 6.0/},
        {s: 'Windows 7',           r: /(Windows 7|Windows NT 6.1)/},
        {s: 'Windows 8.1',         r: /(Windows 8.1|Windows NT 6.3)/},
        {s: 'Windows 8',           r: /(Windows 8|Windows NT 6.2)/},
        {s: 'Windows NT 4.0',      r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
        {s: 'Windows ME',          r: /Windows ME/},
        {s: 'Android',             r: /Android/},
        {s: 'Open BSD',            r: /OpenBSD/},
        {s: 'Sun OS',              r: /SunOS/},
        {s: 'Linux',               r: /(Linux|X11)/},
        {s: 'iOS',                 r: /(iPhone|iPad|iPod)/},
        {s: 'Mac OS X',            r: /Mac OS X/},
        {s: 'Mac OS',              r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
        {s: 'QNX',                 r: /QNX/},
        {s: 'UNIX',                r: /UNIX/},
        {s: 'BeOS',                r: /BeOS/},
        {s: 'OS/2',                r: /OS\/2/},
        {s: 'Search Bot',          r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];

        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(navigator.userAgent)) {
                name = cs.s;
                break;
            }
        }

        if (/Windows/.test(name)) {
            version = /Windows (.*)/.exec(name)[1];
            name = 'Windows';
        }

        switch (name) {
            case 'Mac OS X': version = /Mac OS X (10[\.\_\d]+)/.exec(navigator.userAgent)[1]; break;
            case 'Android':  version = /Android ([\.\_\d]+)/.exec(navigator.userAgent)[1]; break;
            case 'iOS':      version = /OS (\d+)_(\d+)_?(\d+)?/.exec(navigator.appVersion);
                version = version[1] + '.' + version[2] + '.' + (version[3] | 0); break;
        }

        return {name: name, version: version};
    };

    var detectBrouser = function() {
        //browser
        var nAgt = navigator.userAgent;
        var name = navigator.appName;
        var version = parseFloat(navigator.appVersion);
        var nameOffset;
        var verOffset;
        var ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            name = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            name = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            name = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            name = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            name = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            name = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Другие браузеры
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            name = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (name.toLowerCase() == name.toUpperCase()) {
                name = navigator.appName;
            }
        }
        // Обрезает строку версии
        if ((ix = version.indexOf(';')) != -1) {version = version.substring(0, ix);}
        if ((ix = version.indexOf(' ')) != -1) {version = version.substring(0, ix);}
        if ((ix = version.indexOf(')')) != -1) {version = version.substring(0, ix);}

        return {name: name, version: version};
    };

    var detectApple = function() {
        return !!~['iOS','Mac OS X','iOS'].indexOf(detectOS().name);
    };

    var detectMobile = function() {
        return /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(navigator.appVersion);
    };

    BrouserInfo = {
        screenSize: screenSize,
        canvas: isSupportedCanvas(),
        webgl: isSupportedTransformWebGL(),
        css: isSupportedTransformCSS(),
        os: detectOS(),
        brouser: detectBrouser(),
        mobile: detectMobile(),
        apple: detectApple(),
        array: !!window.Float32Array
    };
};
