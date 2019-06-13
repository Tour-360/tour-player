/* globals Tour, Lang, UI */

Tour.vrEnabled = false;
Tour.setVR = function(){
    var btn = WEBVR.createButton( Tour.renderer, {frameOfReferenceType: 'head-model'});

    var onChange = function(){
        Tour.vrEnabled = btn.innerText == 'ENTER VR';
        Tour.renderer.vr.enabled = Tour.vrEnabled;
        btn.click();
        if(Tour.vrEnabled){
            // reportDisplays();
        }else{
            Tour.resize()
        }
    }
    if(btn){
        UI.controlPanel.addBtn('vr', onChange, Lang.get('mousemenu.vr'));
        Tour.pointer.init();
    }
}

