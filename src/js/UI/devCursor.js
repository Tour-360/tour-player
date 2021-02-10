/* globals Tour, UI */

UI.devCursor = {};
UI.devCursor.init = function() {
    if(!UI.devCursor.domElement){
      UI.devCursor.domElement = document.createElement('div');
      UI.devCursor.domElement.classList.add('dev-cursor');
      Tour.domElement.appendChild(UI.devCursor.domElement);
    }
};

UI.devCursor.toggle = function() {
  return UI.devCursor.domElement.classList.toggle('show')
}
