/* globals Tour */

/**
 * Словарь фраз на нескольких языхах
 * коды языков ISO 639-1
 *
 * @type {Object}
 */
Tour.dictionary = {
    'virtual-tour': {
        'en': 'Virtual tour',
        'ru': 'Виртуальный тур',
        'uk': 'Віртуальний тур',
        'de': 'Virtuelle Tour',
        'zh': '虚拟之旅'
    },
    'loading': {
        'en': 'Loading...',
        'ru': 'Загрузка...',
        'uk': 'Завантаження...',
        'de': 'Laden...',
        'zh': '载入中...'
    },

    'mousemenu.back': {
        'en': 'Back',
        'ru': 'Назад',
        'uk': 'Назад',
        'de': 'Zurück',
        'zh': '背部'
    },
    'mousemenu.forward': {
        'en': 'Forward',
        'ru': 'Вперед',
        'uk': 'Уперед',
        'de': 'Vorwärts',
        'zh': '前锋'
    },
    'mousemenu.reload': {
        'en': 'Reload',
        'ru': 'Перезагрузить',
        'uk': 'Перезавантажити',
        'de': 'Neu laden',
        'zh': '刷新'
    },
    'mousemenu.zoomout': {
        'en': 'Zoom out',
        'ru': 'Уменьшить',
        'uk': 'Зменшити',
        'de': 'Rauszoomen',
        'zh': '缩小'
    },
    'mousemenu.zoomin': {
        'en': 'Zoom in',
        'ru': 'Увеличить',
        'uk': 'Збільшувати',
        'de': 'Hineinzoomen',
        'zh': '放大'
    },
    'mousemenu.autorotate': {
        'en': 'Auto rotate',
        'ru': 'Автовращение',
        'uk': 'Автоматичного повороту',
        'de': 'Automatisch drehen',
        'zh': '自动旋转'
    },
    'mousemenu.fullscreen': {
        'en': 'Full screen',
        'ru': 'Во весь экран',
        'uk': 'На весь екран',
        'de': 'voll Schrei',
        'zh': '全屏'
    },
    'mousemenu.hidemenu': {
        'en': 'Hide menu',
        'ru': 'Скрыть меню',
        'uk': 'Сховати меню',
        'de': 'Menü ausblenden',
        'zh': '隐藏菜单'
    },
    'mousemenu.getcode': {
        'en': 'Copy embed code',
        'ru': 'Скопировать код для вставки',
        'uk': 'Скопіюйте код для вставки',
        'de': 'Einbettungscode kopieren',
        'zh': '复制嵌入代码'
    },
    'mousemenu.saveimage': {
        'en': 'Save Image As...',
        'ru': 'Сохранить изображение как...',
        'uk': 'Зберегти зображення як...',
        'de': 'Bild speichern als...',
        'zh': '图像另存为...'
    },
    'mousemenu.visitsite': {
        'en': 'Visit website',
        'ru': 'Перейти на',
        'uk': 'Відвідати сайт',
        'de': 'Besuch',
        'zh': '访问网站'
    },
    'mousemenu.newtab': {
        'en': 'Open tour in new tabe',
        'ru': 'Открыть тур в новой вкладке',
        'uk': 'Відкрити тур в новій вкладці',
        'de': 'Tour in neuem Tab öffnen',
        'zh': '在新标签中打开游览'
    },

    'key.left': {
        'en': 'Left Arrow',
        'ru': 'Стрелка влево',
        'uk': 'стрілка вліво',
        'de': 'Linker Pfeil',
        'zh': '左箭头'
    },
    'key.right': {
        'en': 'Right Arrow',
        'ru': 'Стрелка вправо',
        'uk': 'стрілка вправо',
        'de': 'Rechter Pfeil',
        'zh': '右箭头'
    },
    'key.spase': {
        'en': 'Space',
        'ru': 'Пробел',
        'uk': 'Пробіл',
        'de': 'Raum',
        'zh': '空间'
    },

    'control.left': {
        'en': 'Left',
        'ru': 'Налево',
        'uk': 'Зліва',
        'de': 'Links',
        'zh': '剩下'
    },
    'control.right': {
        'en': 'Right',
        'ru': 'Направо',
        'uk': 'Право',
        'de': 'Recht',
        'zh': '对'
    },
    'control.up': {
        'en': 'Up',
        'ru': 'Вверх',
        'uk': 'Вгору',
        'de': 'Oben',
        'zh': '向上'
    },
    'control.down': {
        'en': 'Down',
        'ru': 'Вниз',
        'uk': 'Вниз',
        'de': 'Nach unten',
        'zh': '下'
    },

    'notification.successfully-copied': {
        'en': 'Code copied to clipboard',
        'ru': 'Код скопирован в буфер обмена',
        'uk': 'Код скопійований в буфер обміну',
        'de': 'Code kopid die Zwischenablage',
        'zh': '代码复制到剪贴板'
    },
    'notification.embed-code': {
        'en': 'Embed code (Press *, to copy)',
        'ru': 'Код для вставки (Нажмите *, чтобы скопировать)',
        'uk': 'Код для вставки (Натисніть *, щоб скопіювати)',
        'de': 'Embed code (Press *, dann Kopien)',
        'zh': '嵌入代码（按 *，复制）'
    },
    'notification.error-load-pano': {
        'en': 'Error loading panorama',
        'ru': 'Ошибка загрузки панорамы',
        'uk': 'Помилка завантаження панорами',
        'de': 'Fehler beim Laden Panorama',
        'zh': '错误加载全景'
    },
    'notification.error-load-img': {
        'en': 'Error loading image',
        'ru': 'Ошибка загрузки изображения',
        'uk': 'Помилка завантаження зображення',
        'de': 'Fehler beim Laden der Bild',
        'zh': '载入图片时出错'
    },
    'notification.error-load-tour': {
        'en': 'Error loading virtual tour',
        'ru': 'Ошибка загрузки виртуального тура',
        'uk': 'Помилка завантаження віртуального туру',
        'de': 'Fehler beim Laden Virtuelle Tour',
        'zh': '错误加载虚拟旅游'
    },
    'notification.error-load-tour-protocol': {
        'en': 'Loading error. Use the http or https protocol for correct tour operation',
        'ru': 'Ошибка загрузки. Используйте протокол http или https для корректной работы тура',
        'uk': 'Помилка завантаження. Використовуйте протокол http або https для коректної роботи туру',
        'de': 'Ladefehler. Verwenden Sie das http- oder https-Protokoll für den korrekten Tour-Vorgang',
        'zh': '加载错误。 使用http或https协议进行正确的巡视操作'
    },

    'gallery.show': {
        'en': 'Show gallery',
        'ru': 'Показать галерею',
        'uk': 'Show gallery',
        'de': 'Galerie anzeigen',
        'zh': '显示图库'
    },
    'gallery.hide': {
        'en': 'Hide gallery',
        'ru': 'Скрыть галерею',
        'uk': 'Приховати галерею',
        'de': 'Galerie ausblenden',
        'zh': '隐藏图库'
    }
};
