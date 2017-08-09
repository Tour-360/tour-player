/* globals Tools */

Tools.setPoint = function() {
    var point = document.createElement('div');

    Object.assign(point.style, {
        position: 'absolute',
        width: '32px',
        height: '32px',
        border: '1px solid black',
        top: 0, left: 0, right: 0, bottom: 0,
        margin: 'auto',
        borderRadius: '100%'
    })
    document.body.appendChild(point);
};
