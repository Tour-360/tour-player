Tour.mousManager = {
    target: false
};

Tour.mousManager.init = function(){
    Tour.renderer.domElement.addEventListener('mousemove', this.onMouseMowe.bind(this), false);
    Tour.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    Tour.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false);
}

Tour.mousManager.getVector = function(event){
    var vector = new THREE.Vector2();
    vector.x = (event.clientX / window.innerWidth) * 2 - 1;
    vector.y = -(event.clientY / window.innerHeight) * 2 + 1;
    return vector;
}

Tour.mousManager.check = function(event){
    var mouse = this.getVector(event);

    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, Tour.camera);
    var intersects = raycaster.intersectObjects(Tour.scene.children, true);

    intersects = intersects.sort(function(a, b){
        return (b.object._onclick?1:0) - (a.object._onclick?1:0) || a.distance - b.distance;
    }).shift();

    var obj = intersects && intersects.object;

    if(obj){
        if(obj._onhover){
            if(this.target != obj){
                this.target && this.target._onover && this.target._onover();
                this.target = obj;
                obj._onhover();
                obj._title && UI.tooltip.setTitle(obj._title)
            }
        }else{
            this.target && this.target._onover && this.target._onover();
            this.target = false;
        }

        UI.layout.setActive(!!obj._onclick);
        UI.tooltip.setVisible(!!obj._title);
        obj._title && UI.tooltip.setPosition(event.clientX, event.clientY)
    }
}

Tour.mousManager.onMouseDown = function(event){
    this.move = false;
    this.startMouse = this.getVector(event);
}

Tour.mousManager.onMouseMowe = function(event){
    this.move = true;
    if(event.which){
        UI.tooltip.setVisible(false)
        return false
    }
    this.check(event)
}

Tour.mousManager.onMouseUp = function(event){
    this.check(event);
    if(this.getVector(event).distanceTo(this.startMouse) < 0.01){
        if(this.target && this.target._onclick){
            window.navigator.vibrate && Tour.options.vibrate && window.navigator.vibrate(25)
            this.target._onclick(event);
        }
    }
}