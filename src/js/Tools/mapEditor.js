/* globals Tools */

Tools.mapEditor = {}

Tools.mapEditor.init = function(){
    Tools.editor = window.open(
      Tour.options.tools,
      '_blank',
      Object.entries({
        width: 1280,
        height: 800,
        left: 10,
        top: 10,
        toolbar: 0,
        location: 0,
        menubar: 0,
      }).map(function(e) {
        return e.join("=");
      }).join(',')
    );

    Tools.mapEditor.link();

    window.addEventListener("beforeunload", function(e){
        Tools.editor.close()
    }, false);
}

Tools.mapEditor.link = function(){
    Tools.editor.addEventListener('load', function(){
        Tools.editor.Tour = Tour;
        Tools.editor.THREE = THREE;
        Tools.editor.parent = window;
        Tools.editor.addEventListener('unload', function(){
            setTimeout(Tools.mapEditor.link, 1);
        }, false);
        // Tools.editor.addEventListener("beforeunload", function(e){
        //     console.log('beforeunload');
        // }, false);
    });
    Tools.editor.focus()
}
