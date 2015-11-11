/* globals Tour*/

/**
 * Параметры посмотра
 * поворот камеры, угол обзора, id текущей панорамы
 * @type {Object}
 */
Tour.view = {
    fov: new Tour.Anim(90),
    lat: new Tour.Anim(0),
    lon: new Tour.Anim(0),
    id: 0
};
