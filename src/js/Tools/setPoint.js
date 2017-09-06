/* globals Tools */

Tools.setPoint = function() {
    var directions = ['up', 'right', 'down', 'left', 'point', 'info'];
    var currentDirection = -1;

    var onclick = function(){
        Tools.point = {icon: directions[++currentDirection%directions.length]}
        point.setIcon(Tools.point.icon);
    }

    var point = new UI.Marker(onclick, false, false);

    Object.assign(point.domElement.style, {
        top: 0, left: 0, right: 0, bottom: 0,
        margin: 'auto'
    })
    onclick();
};
