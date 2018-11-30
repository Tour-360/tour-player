/* globals Tools */

Tools.copyMarker = function(id) {
    if(this.point.icon == 'info'){
    	this.copyInfoMarker(
    		prompt('Enter title for info marker', 'title'),
    		prompt('Enter popup id', '')
    	);
    } else {
    	this.copyDirectionMarker(prompt('Enter pano id', Tour.view.id));
    }
};
