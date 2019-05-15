/* globals Tour, Lang, UI */

Tour.vrEnabled = false;
Tour.setVR = function(){
    var btn = WEBVR.createButton( Tour.renderer, {frameOfReferenceType: 'head-model'});

    var onChange = function(){
        Tour.vrEnabled = btn.innerText == 'ENTER VR';
        Tour.renderer.vr.enabled = Tour.vrEnabled;
        if(this.vrEnabled){

        }
        btn.click();
        Tour.needsUpdate = true;
    }
    if(btn){
        UI.controlPanel.addBtn('vr', onChange, Lang.get('mousemenu.vr'));
        Tour.pointer.init();
    }
}
