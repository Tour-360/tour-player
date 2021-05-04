/* globals Tour, UI */

UI.devCursor = {};
UI.devCursor.init = function(value) {
    if(!UI.devCursor.domElement){
      UI.devCursor.domElement = document.createElement('div');
      UI.devCursor.domElement.classList.add('dev-cursor');
      Tour.domElement.appendChild(UI.devCursor.domElement);
    }
    this.set(value);
};

UI.devCursor.toggle = function() {
  return UI.devCursor.domElement.classList.toggle('show')
}

UI.devCursor.set = function(value) {
  return UI.devCursor.domElement.classList[value?'add':'remove']('show')
}