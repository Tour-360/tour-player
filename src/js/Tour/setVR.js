Tour.setVR = function(){
    UI.controlPanel.btnList.appendChild(WEBVR.createButton( Tour.renderer, {frameOfReferenceType: 'head-model'}));
}
