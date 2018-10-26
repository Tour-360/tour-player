/* globals Tools */

Tools.init = function() {
    this.setPoint();
    window.addEventListener('keydown', function(event) {
    	if(event.keyCode == 13){
    		Tools.copyMarker();
    	}
    });
};
