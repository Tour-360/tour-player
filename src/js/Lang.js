var Lang = {};

/**
 * Язык по умолчанию, он будет выбран,
 * если в словаре нет нужного языка.
 *
 * @type {String}
 */
Lang.default = 'en';

/**
 * Устанавливает язык на тот, что указан в первом параметре,
 * или из тега <html lang>,
 * или navigator.language
 * или navigator.userLanguage (EI)
 * или на русский "ru"
 *
 * @param {String} language ISO 639-1 Код языка
 * @param {String} dictionary Словарь фраз на нескольких языхах
 * @return {String} Возвращает ISO 639-1 код установленного языка
 */
Lang.set = function(language, dictionary) {
    this.language = (
        language                      ||
        document.documentElement.lang ||
        navigator.language            ||
        navigator.userLanguage        ||
        this.default
    ).split('-')[0];

    if (dictionary) {
        this.dictionary = dictionary;
    }

    return this.language;
};

/**
 * Преобразует Языковой объект во вразу установленного языка.
 * Если фразы нужного языка нет, то возвращает враузу языка по умолчанию.
 * Если передан не объект, то возвращает его без преобразований.
 *
 * @param  {Object} value Языковой объект
 *                        или строка
 * @return {String}       Фразу установленного языка
 */
Lang.translate = function(value) {
    if (typeof value === 'object') {
        return value[this.language] || value[this.default];
    } else {
        return value;
    }
};

/**
 * Возвращает фразу по ключу из словаря
 *
 * @param  {String} key Ключ фразы в словаре
 * @return {String}     Фраза из словаря
 */
Lang.get = function(key) {
    if (Lang.dictionary[key]) {
        return this.translate(this.dictionary[key]);
    } else {
        return '[' + key + ']';
    }
};
