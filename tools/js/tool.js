// SHIFT


var points = [];

function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

var state = {
  current: null,
  count: -1,
  name: null,
  states: [],
  firstLoad: true, 

  push: function(code){
    this.states[this.count] = code;
    this.count = this.states.length;
  },
  getCode: function(format){
    return JSON.stringify(this.current, null, format && 2);
  },
  save: function(){
    if(!this.clear){
      var code = this.getCode();
      localStorage[this.name] = code;
      this.states[++this.count] = code;
    }
  },
  set: function(){
    var startView = localStorage.view && JSON.parse(localStorage.view) 

    points = [];
    select.points = [];
    map.pointsElement.innerHTML = '';
    Tour.data = this.current;
    //slice(0,100)
    this.current.panorams.forEach(function(pano){
      var point = new Point(pano);
      point.draw(true);
      points.push(point);
    })

    if(this.firstLoad){
      var startView = localStorage.view && JSON.parse(localStorage.view) 
      var activePoint = utils.findPoinnt(Tour.view.id);
      activePoint.select(true);
      console.log(startView)
      camera.lookAt(startView || activePoint);
      this.firstLoad = false;
    }

    Tour.setPanorama(Tour.view.id);
    properties.set();
    camera.draw();
    links.draw();
    links.setPoints();
  },
  get: function(){
    this.name = Tour.data.name || prompt('project name:', 'myProject');
    // this.name = this.name || prompt('project name:', 'myProject');
    this.current = localStorage[this.name]? JSON.parse(localStorage[this.name]) : Tour.data;
    this.current.name = this.name;
    if(!this.current.floors){
      this.current.floors = [
        {height: 300, title:'first level', plan: null }
        // plan: {imageUrl: '../floors/0.svg', x:0, y:0, width:6830.492121379737}
      ]
    }
    floors.setFloors();
    this.set();
    this.save();
    return this.current;
  },
  undo: function(){
    if(this.count>0){
      this.count--;
      this.current = JSON.parse(this.states[this.count]);
      this.set();
    }else{
      toasts.push('Can not be undo')
    };
  },
  redo: function(){
    if(this.count<this.states.length-1){
      this.count++;
      this.current = JSON.parse(this.states[this.count]);
      this.set();
    }else{
      toasts.push('Can not be redo')
    };
  },
  saveAsFile: function(){
    var date = new Date();
    var dateStr =
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) + "-" +
      date.getFullYear() + "_" +
      ("00" + date.getHours()).slice(-2) + "-" +
      ("00" + date.getMinutes()).slice(-2) + "-" +
      ("00" + date.getSeconds()).slice(-2);

    var blob = new Blob([this.getCode(true)], {type: "application/json"});
    var url  = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.download    = dateStr+".json";
    a.href        = url;
    a.textContent = a.download;
    a.click()
  },
  saveToServer: function(){
    fetch('/save', { method: "POST", headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify({ manifest: parent.Tour.options.manifest, password: '1', tour: {a: 1}})});
  }
};

var camera = {
  x: 0,
  y: 0,
  defaultScale: 0.42,
  scale: 0.42,
  width: 0,
  height: 0,
  offsetTop: 0,
  offsetLeft: 0,
  fovPoint: null,
  trackingTour: false,
  trackingMap: false,

  update: function(){
    this.width = map.domElement.clientWidth;
    this.height = map.domElement.clientHeight;
    this.offsetTop = map.domElement.offsetTop;
    this.offsetLeft = map.domElement.offsetLeft;
    this.draw();
  },
  setPosition: function(x, y, scale){
    this.x = x;
    this.y = y;
    this.setScale(scale);
    this.draw();
  },
  lookAt: function(position){
    this.x = -position.x*this.scale+(this.width/2);
    this.y = -position.y*this.scale+(this.height/2);
    if(position.scale!= undefined && position.scale != this.scale){
      this.setScale(position.scale);
    }
    if(position.floor != undefined && position.floor != floors.active){
      floors.showFloor(Math.floor(position.floor))
    }
    this.draw();
    links.draw()
    this.save();
  },
  getView: function(){
    return {
      x: -(this.x-this.width/2)/this.scale,
      y: -(this.y-this.height/2)/this.scale
    }
  },
  setScale: function(scale){
    var view = camera.getView();
    this.scale = Math.max(0.08, Math.min(1.68, scale));
    this.lookAt(view);
    links.hide()
    links.debounceDraw()
  },
  save: function(){
    var cameraPosition = this.getView()
    localStorage.view = JSON.stringify({
      x:cameraPosition.x,
      y:cameraPosition.y,
      scale:camera.scale,
      floor:floors.active || 0
    })
  },
  draw: function(){
    // map.domElement.style.backgroundPosition = this.x+'px '+this.y+'px';
    map.domElement.style.setProperty('--scale', this.scale*(100/42));
    map.domElement.style.setProperty('--offset-x', this.x+'px');
    map.domElement.style.setProperty('--offset-y', this.y+'px');
    points.forEach(function(point){
      point.setPosition(true);
    })

    connectiPoints.forEach(function(point){
      point.draw();
    })
    map.setFov();
    floors.setPosition()
  },
  fovChange: function(e){
    this.fovPoint =  utils.findPoinnt(e.id);
    map.setFov();
    if(camera.trackingTour && !document.hasFocus()){
      select.all(false);
      var activePoint = utils.findPoinnt(Tour.view.id);
      activePoint.select(true);
      camera.lookAt(activePoint)
      properties.set();
    }
  },
  updateLinks: function(){
    Tour.pointsManager.set(Tour.view.id)
    Tour.nadirControl.set()
    Tour.needsUpdate = true;
  },
  toAbsolutePosition: function(object){
    return {
      x: object.x * this.scale + camera.x,
      y: object.y * this.scale + camera.y,
      radius: object.radius
    }
  },
  checkVisibility: function(object){
    // var absolutePosition = this.toAbsolutePosition(object)
    var result = object.x>-object.radius &&
    object.y>-object.radius &&
    object.x<camera.width+object.radius &&
    object.y<camera.height+object.radius
    return result;
  }
}

var map = {
  start: {x: 0, y:0},
  mouse: {x: 0, y:0},
  init: function(){
    this.domElement = document.querySelector('.map');
    this.pointsElement = document.querySelector('.points');
    this.fovElement = document.querySelector('.point-fov');
    this.connectionPointsElement = document.querySelector('.connection-points');
    this.fovCTX = this.fovElement.getContext('2d');
    this.onMouseMove = this.mouseMove.bind(this);
    this.onMouseUp = this.mouseUp.bind(this);
    this.onMouseDown = this.mouseDown.bind(this);

    this.domElement.addEventListener('mousedown', this.onMouseDown);
    this.domElement.addEventListener('mousewheel', this.mouseWheel);
    this.domElement.addEventListener('contextmenu', this.contextmenu);

    document.addEventListener('keydown', this.keyDown)
    window.addEventListener('resize', camera.update.bind(camera));
    Tour.on('changeView', camera.fovChange.bind(camera));
    Tour.on('moveview', this.setFov.bind(this));
  },
  changeView: function(){

  },
  setFov: function(){
    if(camera.fovPoint){
      var x = camera.fovPoint.x * camera.scale + camera.x
      var y = camera.fovPoint.y * camera.scale + camera.y
      var size = camera.fovPoint.heightFromFloor*2*camera.scale;
      var radius = size/2

      if(
        x>-radius &&
        y>-radius &&
        x<camera.width+radius &&
        y<camera.height+radius
      ){
        this.fovElement.classList.add('visible')
        this.fovElement.width = size*2;
        this.fovElement.height = this.fovElement.width;

        var view = Tour.view.get()
        var lon = (view.lon+90) * -Math.PI / 180;
        var fov = Tour.view.fov.value  * Math.PI / 180 /2;

        this.fovCTX.lineWidth=20;
        this.fovCTX.strokeStyle  = "rgba(255, 255, 255, .9)";
        this.fovCTX.beginPath();
        this.fovCTX.arc(size, size, radius, lon+fov, lon-fov, true);
        this.fovCTX.stroke()

        this.fovElement.style.setProperty('--size', size+'px');
        this.fovElement.style.transform = 'translate('+x+'px, '+y+'px)';
      }

    }
  },
  mouseDown: function(event){
    select.rect.active = event.altKey;
    if(select.rect.active){
      select.rect.top = event.pageY-camera.offsetTop;
      select.rect.left = event.pageX-camera.offsetLeft;
    }
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    this.mouse.x = event.pageX - camera.x - camera.offsetLeft;
    this.mouse.y = event.pageY - camera.y - camera.offsetTop;
    this.start.x = camera.x;
    this.start.y = camera.y;
  },
  contextmenu : function(event){
    event.preventDefault();
  },
  mouseMove: function(event){
    if(!select.rect.active){
      camera.x = event.pageX - this.mouse.x - camera.offsetLeft;
      camera.y = event.pageY - this.mouse.y - camera.offsetTop;
      this.set()
      links.hide()
    }else{
      select.rect.width = event.pageX - select.rect.left - camera.offsetLeft;
      select.rect.height = event.pageY- select.rect.top - camera.offsetTop;
      select.setRect(event.shiftKey)
    }
  },
  mouseUp: function(event){
    if(select.rect.active){
      select.rect.active = false;
      select.setRect(event.shiftKey)
    }else if(this.start.x == camera.x && this.start.y == camera.y){
      select.all(false);
    }
    properties.set();
    links.draw()
    camera.save()

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  },
  mouseWheel: function(event){
    event.stopPropagation();
    event.preventDefault();
    camera.setScale(camera.scale + event.wheelDeltaY/5000)
  },
  set: function(){
    // map.style.transform = 'translate('+this.x+'px, '+this.y+'px)'
    // map.style.backgroundPosition = this.x+'px '+this.y+'px'
    camera.draw();
    this.setFov();
  },
  keyDown: function(event){
    // console.log(event.code)
    if (event.code == 'KeyA' && (event.ctrlKey || event.metaKey)){
      event.preventDefault();
      select.all(true);
    }
    if (event.code == 'KeyG' && (event.ctrlKey || event.metaKey)){
      event.preventDefault();
      utils.alignSelectedPoints();
    }
    if (event.code == 'Equal' && (event.ctrlKey || event.metaKey)){
      event.preventDefault();
      camera.setScale(camera.scale * 1.2);
    }
    if (event.code == 'Minus' && (event.ctrlKey || event.metaKey)){
      event.preventDefault();
      camera.setScale(camera.scale / 1.2);
    }
    if (event.code == 'Digit0' && (event.ctrlKey || event.metaKey)){
      event.preventDefault();
      camera.setScale(camera.defaultScale);
    }
    if (event.code == 'KeyL' && (event.ctrlKey || event.metaKey) && event.shiftKey){
      event.preventDefault();
      utils.removeAllLinks()
    }
    if (event.code == 'KeyF' && (event.ctrlKey || event.metaKey) && !event.shiftKey){
      event.preventDefault();
      utils.findAndShowPoint();
    }
    if (event.code == 'KeyF' && (event.ctrlKey || event.metaKey) && event.shiftKey){
      event.preventDefault();
      utils.findAndMovePoint();
    }
    if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey) && !event.shiftKey){
      event.preventDefault();
      state.undo();
    }
    if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey) && event.shiftKey){
      event.preventDefault();
      state.redo();
    }
    if (event.code == 'KeyS' && (event.ctrlKey || event.metaKey) && !event.shiftKey){
      event.preventDefault();
      state.saveAsFile()
    }
    if (event.code == 'KeyS' && (event.ctrlKey || event.metaKey) && !event.shiftKey && event.altKey){
      event.preventDefault();
      state.saveToServer()
    }
    if (event.code == 'ArrowUp'){
      event.preventDefault();
      utils.movePoints('up', event.shiftKey);
    }
    if (event.code == 'ArrowDown'){
      event.preventDefault();
      utils.movePoints('down', event.shiftKey);
    }
    if (event.code == 'ArrowLeft'){
      event.preventDefault();
      utils.movePoints('left', event.shiftKey);
    }
    if (event.code == 'ArrowRight'){
      event.preventDefault();
      utils.movePoints('right', event.shiftKey);
    }
  }
}

var select = {
  points: [],
  active: null,
  all: function(value, some){
    points.forEach(function(point){
      point.select(value || (some && point.selected));
    })
    properties.set()
  },
  init: function(value){
    this.domElement = document.querySelector('.select-control')
  },
  rect: {
    active: false,
    width: 0,
    height: 0,
    top: 0,
    left: 0
  },
  setRect: function(concat){
    points.forEach(function(point){
      point.select(
        (point.x*camera.scale > select.rect.left-camera.x &&
          point.y*camera.scale > select.rect.top-camera.y &&
          point.x*camera.scale < select.rect.left+select.rect.width-camera.x &&
          point.visible &&
          point.y*camera.scale < select.rect.top+select.rect.height-camera.y) ||
        (concat && point.selected)
      );
    })
    select.domElement.style.width = Math.max(0, this.rect.width)+'px';
    select.domElement.style.height = Math.max(0, this.rect.height)+'px';
    select.domElement.style.transform = 'translate('+this.rect.left+'px, '+this.rect.top+'px)'
    select.domElement.classList[this.rect.active?'add':'remove']('active')
  }
}

connectiPoints =[]

var ConnectiPoint = function(event, links){
  if(event.target){
    this.x = (event.pageX- camera.offsetLeft) /camera.scale-camera.x/camera.scale
    this.y = (event.pageY- camera.offsetTop) /camera.scale-camera.y/camera.scale
  }else{
    this.x = event.x || 0;
    this.y = event.y || 0;
  }
  this.radius = 4;
  this.mouse = {};
  this.links = links;

  this.onMouseMove = this.mouseMove.bind(this);
  this.onMouseUp = this.mouseUp.bind(this);
  this.onMouseDown = this.mouseDown.bind(this);
  this.onContextMenu = this.contextMenu.bind(this);

  this.domElement = document.createElement('div');
  this.domElement.classList.add('connection-point');

  map.connectionPointsElement.appendChild(this.domElement);
  if(event.target){
    this.mouseDown(event);
    this.mouseMove(event);
  }else{
    this.draw();
  }

  this.domElement.addEventListener('mousedown', this.onMouseDown);
  this.domElement.addEventListener('contextmenu', this.onContextMenu);
  connectiPoints.push(this)
}

ConnectiPoint.prototype.mouseDown = function(event){
  event.stopPropagation();
  if(event.which == 1){
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

    this.mouse.x = event.pageX - this.x*camera.scale + camera.offsetLeft;
    this.mouse.y = event.pageY - this.y*camera.scale + camera.offsetTop;
  }else if(event.which == 3){
    this.remove(true);
    links.draw()
    state.save()
  }
  this.draw();
}

ConnectiPoint.prototype.mouseMove = function(event){
  event.stopPropagation();
  var mouseX = event.pageX - this.mouse.x  + camera.offsetLeft 
  var mouseY = event.pageY - this.mouse.y + camera.offsetTop

  this.x = mouseX/camera.scale// - this.x;
  this.y = mouseY/camera.scale// - this.y;

  this.links.forEach(function(link){
    link.x = this.x;
    link.y = this.y;
  }.bind(this))
  this.draw();
  links.draw()

}

ConnectiPoint.prototype.mouseUp = function(event){
  event.stopPropagation();
  document.removeEventListener('mousemove', this.onMouseMove);
  document.removeEventListener('mouseup', this.onMouseUp);
  links.draw();
  state.save();
}
ConnectiPoint.prototype.draw = function(){
  var absolute = camera.toAbsolutePosition(this);
  var inViewPort = camera.checkVisibility(absolute)
  var visible = this.links.some(function(link){
    var floor = Math.floor(utils.findPoinnt(link.id).floor);
    return floor < Math.floor(floors.active)+1 && floor > Math.floor(floors.active)-1
  }) && inViewPort

  if(visible){
    this.domElement.style.transform = 'translate('+absolute.x+'px, '+absolute.y+'px)';
  }
  this.domElement.style.display = visible?'block':'none'
}
ConnectiPoint.prototype.contextMenu = function(){
  event.stopPropagation();
  event.preventDefault();
}
ConnectiPoint.prototype.remove = function(forse){
  map.connectionPointsElement.removeChild(this.domElement);
  connectiPoints.splice(connectiPoints.indexOf(this), 1);
    if(forse)this.links.forEach(function(link){
      delete link.x;
      delete link.y;
    })
  delete this
}




var Point = function(panorama){
  this.panorama = panorama;
  this.x = panorama.x || 0;
  this.y = panorama.y || 0;
  this.rotate = panorama.heading || 0;
  this.selected = false;
  this.heightFromFloor = this.panorama.heightFromFloor || 154;
  this.panorama.heightFromFloor = this.heightFromFloor
  this.floor = this.panorama.floor || 0;
  this.panorama.floor = this.floor
  this.radius = 388.08 / 2;
  this.update = false;
  this.visible = false;
  this.hidden = false;
  this.secondary = false;

  this.mouse = {x: 0, y:0};
  this.start = {x: 0, y:0};

  this.rotateElement = document.createElement('div');
  this.rotateElement.classList.add('point-rotate-control');

  this.numberElement = document.createElement('div');
  this.numberElement.classList.add('point-number');

  this.domElement = document.createElement('div');
  this.domElement.classList.add('point');
  this.domElement.appendChild(this.numberElement);
  this.domElement.appendChild(this.rotateElement);

  map.pointsElement.appendChild(this.domElement);

  this.onMouseMove = this.mouseMove.bind(this);
  this.onMouseUp = this.mouseUp.bind(this);
  this.onMouseDown = this.mouseDown.bind(this);
  this.onDblClick = this.dblClick.bind(this);

  this.onMouseDownRotate = this.mouseDownRotate.bind(this);
  this.onMouseMoveRotate = this.mouseMoveRotate.bind(this);
  this.onMouseUpRotate = this.mouseUpRotate.bind(this);

  this.domElement.addEventListener('mousedown', this.onMouseDown);
  this.domElement.addEventListener('dblclick', this.onDblClick);
  this.rotateElement.addEventListener('mousedown', this.onMouseDownRotate);
}

Point.prototype.select = function(value, invert){
  var selected = (invert&&this.selected==value)? !value : value;
  if(selected && !this.selected){
    this.domElement.classList.add('active');
    this.selected = selected;
    select.points.push(this);
    if(camera.trackingMap && !parent.document.hasFocus()){
      Tour.view.set({id:select.points[0].panorama.id})
    }
  }else if(!selected && this.selected){
    this.domElement.classList.remove('active');
    this.selected = selected;
    select.points.splice(select.points.indexOf(this), 1);
  }
  select.active = this;
}

Point.prototype.getDispaly = function(){
  var links = this.panorama.links && this.panorama.links.length && this.panorama.links.some(function(link){
    return Math.floor(Tour.getPanorama(link.id).floor) == floors.active;
  })

  this.hidden = !links && (floors.active >= this.floor + 1 || floors.active <= this.floor - 1);
  this.secondary = floors.active != this.floor || (this.hidden && links);
}

Point.prototype.setPosition = function(norotate, forse){
  this.panorama.x = this.x;
  this.panorama.y = this.y;
  this.panorama.heading = this.rotate;
  var size = this.heightFromFloor*2*camera.scale;
  this.radius = size/2;

  this.getDispaly() //todo optim

  var absolute = camera.toAbsolutePosition(this);
  var inViewPort = camera.checkVisibility(absolute)

  var draw = forse || (inViewPort && !this.hidden)

  if(draw || this.update){
    this.domElement.style.transform = 'translate('+absolute.x+'px, '+absolute.y+'px) rotate('+this.rotate+'deg)';
    if(!norotate)this.numberElement.style.transform = 'rotate('+(-this.rotate)+'deg)';
    this.domElement.style.setProperty('--point-size', size+'px');
    this.domElement.classList[this.hidden?'add':'remove']('hidden');
    this.domElement.classList[this.secondary?'add':'remove']('secondary');
    this.visible = true;
  }else{
    this.visible = false;
  }

  this.update = draw;
}

Point.prototype.getAbsolutePosition = function(){
  return {
    x: this.x * camera.scale + camera.x,
    y: this.y * camera.scale + camera.y
  }
}

Point.prototype.drawLins = function(){
  var x1 = this.x * camera.scale + camera.x
  var y1 = this.y * camera.scale + camera.y
}

Point.prototype.draw = function(forse){
  this.numberElement.innerText = this.panorama.id;
  // this.domElement.title = this.panorama.title;

  const uwnImage = [
    parent.location.origin,
    parent.location.pathname,
    'panorams',
    this.panorama.id,
    'thumbnail/uwn.jpg'
  ].join('/');

  this.domElement.style.backgroundImage = `url(${uwnImage})`;
  this.setPosition(false, forse);
}

Point.prototype.dblClick = function(event){
  Tour.view.set({id:this.panorama.id})
}

Point.prototype.mouseDown = function(event){
  event.stopPropagation();
  if(!event.altKey){
    if(!event.shiftKey && !this.selected){
      select.all(false);
    }
    this.select(true, event.shiftKey);
    this.mouse.x = event.pageX - this.x*camera.scale;
    this.mouse.y = event.pageY - this.y*camera.scale;
    this.start.x = this.x;
    this.start.y = this.y;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }else{
    if(select.points.length > 10 && !confirm('>10?')) return false //todo

    var that = this;
    select.points.forEach(function(point){

      if(point.panorama.id == that.panorama.id) return false

      if(that.panorama.links && that.panorama.links.find(function(n){return n.id == point.panorama.id})){
        point.panorama.links = point.panorama.links.filter(function(n){return n.id != that.panorama.id})
        that.panorama.links = that.panorama.links.filter(function(n){return n.id != point.panorama.id})
        links.setPoints()
      }else{
        if(!point.panorama.links) point.panorama.links = [];
        point.panorama.links.push({id: that.panorama.id})

        if(!that.panorama.links) that.panorama.links = [];
        that.panorama.links.push({id: point.panorama.id})
      }
    })
    links.draw();
    state.save();

    if(!select.points.lenght){
      //todo
    }
  }
}

Point.prototype.move = function(x, y){
  this.x += x;
  this.y += y;
  this.setPosition();
}

Point.prototype.mouseMove = function(event){
  event.stopPropagation()
  var mouseX = event.pageX - this.mouse.x;
  var mouseY = event.pageY - this.mouse.y;

  var shiftX = mouseX/camera.scale - this.x;
  var shiftY = mouseY/camera.scale - this.y;
  select.points.forEach(function(point){
    point.move(shiftX, shiftY)
  })

  links.hide()
  map.setFov();

  camera.updateLinks()
}

Point.prototype.mouseUp = function(event){
  event.stopPropagation()
  // if(this.start.x==this.x && this.start.x==this.x){
  //   Tour.view.set({id:this.panorama.id})
  // }
  document.removeEventListener('mousemove', this.onMouseMove);
  document.removeEventListener('mouseup', this.onMouseUp);
  properties.set();
  // if(this.x == this.start.x && this.y== this.start.y){
  //   Tour.view.set({id:this.id})
  // }
  state.save()
  links.draw()
}

Point.prototype.mouseDownRotate = function(event){
  event.stopPropagation();
  this.domElement.classList.add('rotate')
  document.addEventListener('mousemove', this.onMouseMoveRotate);
  document.addEventListener('mouseup', this.onMouseUpRotate);
  if(Tour.view.id == this.panorama.id){
    this.cameraShift = -this.panorama.heading-Tour.view.lon.value
  }
}

Point.prototype.mouseMoveRotate = function(event){
  var a = event.pageX - (camera.x+this.x*camera.scale) - camera.offsetLeft;
  var b = event.pageY - (camera.y+this.y*camera.scale) - camera.offsetTop;
  this.panorama.heading = this.rotate = (THREE.Math.radToDeg(Math.atan2(b, a))+90) % 360;
  if(Tour.view.id == this.panorama.id){
    if(event.altKey){
      Tour.view.set({lon:-this.panorama.heading-this.cameraShift})
    }else{
      this.cameraShift = -this.panorama.heading-Tour.view.lon.value
    }
    Tour.mesh.rotation.set(0, Math.PI / 2 - THREE.Math.degToRad(this.panorama.heading || 0), 0);
    Tour.needsUpdate = true;
  }
  this.setPosition();
  camera.updateLinks()
}

Point.prototype.mouseUpRotate = function(event){
  event.stopPropagation();
  this.domElement.classList.remove('rotate')
  document.removeEventListener('mousemove', this.onMouseMoveRotate);
  document.removeEventListener('mouseup', this.onMouseUpRotate);
  properties.set();
  state.save()
}


function init(){
  floors.init()
  map.init()
  camera.update();
  links.init();
  properties.init()
  state.get();
  select.init();
  //links.setPoints()

  Tour.defaultOption.limit = Tour.options.limit = {
    fov: { min: 15, max: 120},
    lat: { min: -85, max: 85},
    lon: { min: false, max: false}
  }


  window.onbeforeunload = state.save.bind(state);
}

var properties = {
  setPointsValue: function(key, value){
    select.points.forEach(function(point){
      point.panorama[key] = value
      point.x = point.panorama.x;
      point.y = point.panorama.y;
      point.rotate = point.panorama.heading;
      point.heightFromFloor = point.panorama.heightFromFloor;
      point.floor = point.panorama.floor;
      point.draw(true);
    })
  },
  set: function(){
    if(select.points.length){
      var point = select.points[0];
      this.inputs.forEach(function(input){
        var key = input.getAttribute('data-key');
        input.value = point.panorama[key];
        var warning = select.points.some(function(otherPoint){
          return otherPoint.panorama[key] != point.panorama[key]
        })
        input.classList[warning?'add':'remove']('warning')
      })
    }else{
      this.inputs.forEach(function(input){
        input.value = '';
        input.classList.remove('warning')
      })
    }
  },
  onChange: function(event){
    var input = event.target;
    var key = input.getAttribute('data-key');
    var type = input.getAttribute('data-type');
    var value = input.value;

    if(input.type == 'number'){
      value = parseFloat(value)
    }

    this.setPointsValue(key, value);
    links.draw();
  },
  init: function(){
    this.inputs = document.querySelectorAll('.properties input[data-key]');
    var that = this;
    this.inputs.forEach(function(input){
      input.addEventListener('change', that.onChange.bind(that));
      input.addEventListener('keydown', function(event){
        event.stopPropagation()
      });
    })
  }
}

utils = {
  movePoints: function(direction, shift){
    var x = 0;
    var y = 0;
    var distance = 1;
    if(camera.scale < 0.3){
      distance = 100;
    }else if(camera.scale < 1){
      distance = 10;
    }

    if(shift)distance *= 10;

    if(direction == 'up'){
      y = -distance
    }else if(direction == 'down'){
      y = distance
    }else if(direction == 'left'){
      x = -distance
    }else if(direction == 'right'){
      x = +distance
    }

    select.points.forEach(function(point){
      point.move(x, y)
    })

    links.draw();
    properties.set()
    state.save();
  },
  alignSelectedPoints: function(){
    if(select.points.length){
      var greedSize = Math.max.apply(null, select.points.map(function(point){
        return point.heightFromFloor
      }))*2 + 10;

      var greedWidth = Math.ceil(Math.sqrt(select.points.length));
      var centerX = select.points.map((a) => (a.x)).reduce((a, b) => (a + b)) / select.points.length
      var centerY = select.points.map((a) => (a.y)).reduce((a, b) => (a + b)) / select.points.length

      centerX -= (greedWidth-1)*greedSize/2
      centerY -= (greedWidth-1)*greedSize/2

      select.points.sort(function(a, b){
        return a.panorama.id - b.panorama.id
      }).forEach(function(point, n){
        point.x = point.panorama.x = centerX + (n%greedWidth) * greedSize;
        point.y = point.panorama.x = centerY + Math.floor(n/greedWidth) * greedSize;
        point.setPosition()
      })
      links.draw();
      state.save();
    }else{
      toasts.push('No points selected');
    }
  },
  setStartPanorama: function(){
    if(select.points.length == 1){
      var panoramaId = select.points[0].panorama.id;
      if(panoramaId == Tour.view.id){
        Tour.data.start = panoramaId;
        state.save()
        toasts.push('This panorama is set as home');
      }else{
        toasts.push('This panorama is not in view');
      }
    }else if(select.points.length > 1){
      toasts.push('more than 1 panorama selected');
    }else if(!select.points.length){
      toasts.push('No panorama selected');
    }
  },
  setDefaultView: function(lonOnly){
    if(select.points.length == 1){
      var panorama = select.points[0].panorama
      if(panorama.id == Tour.view.id){
        panorama.lon = Tour.view.lon.value;
        if(!lonOnly){
          panorama.lat = Tour.view.lat.value;
          panorama.fov = Tour.view.fov.value;
        }
        properties.set();
        state.save()
        toasts.push('This panorama is set default view');
      }else{
        toasts.push('This panorama is not in view');
      }
    }else if(select.points.length > 1){
      toasts.push('More than 1 panorama selected');
    }else if(!select.points.length){
      toasts.push('No panorama selected');
    }
  },
  removeAllLinks: function(lonOnly){
    var removeFlag = false;
    if(select.points.length){
      select.points.forEach(function(point){
        if(point.panorama.links && point.panorama.links.length)point.panorama.links.forEach(function(p){
          removeFlag = true;
          var panorama = utils.findPoinnt(p.id).panorama;
          panorama.links = panorama.links.filter(function(n){
            return n.id != point.panorama.id;
          })
        })
        point.panorama.links = [];
        links.setPoints()
      })
      if(removeFlag)state.save()
      links.draw();
      toasts.push('Аll links have been removed for selected points');
      state.save();
    }else{
      toasts.push('No points selected');
    }
  },
  clearStorage: function(){
    state.clear = true;
    if(confirm("clear storage?")){
      localStorage.clear();
      parent.location.reload();
    }
  },
  findPoinnt: function(id){
    return points.find(function(point){return point.panorama.id == id})
  },
  findAndMovePoint: function(){
    var id = prompt('point id', 0)
    var point = this.findPoinnt(id)
    if(point){
      var view = camera.getView();
      point.x = view.x;
      point.y = view.y;
      point.floor = point.panorama.floor = floors.active;
      point.setPosition()
      state.save()
    }else{
      toasts.push('Point with id: '+id+' not found');
    }
  },
  showActivePoint: function(){
    if(select.points.length){
      camera.lookAt(select.points[0])
    }else{
      //todo
    }
  },
  showFOVPoint: function(){
    camera.lookAt(utils.findPoinnt(Tour.view.id))
  },
  findAndShowPoint: function(){
    var id = prompt('point id', 0)
    var point = this.findPoinnt(id)
    if(point){
      camera.lookAt(point);
    }else{
      toasts.push('Point with id: '+id+' not found');
    }
  }
}


var floors = {
  active: null,
  init: function(){
    this.floorList = document.querySelector('.floor-list');
    this.plans = document.querySelector('.plans');
    // this.setFloors();
    // this.showFloor(0);
  },
  setFloors: function(){
    menu.items.floor.addItem('selectFloor', {
      title: 'Select Floor',
      type: 'select',
      options: Object.fromEntries(
        state.current.floors
          .map((floor, id) => ([ id, floor.title ]))
      ),
      action: (id) => {
        toasts.push(`Selected ${state.current.floors[id].title}`);
        floors.showFloor(id);
      }
    });

    state.current.floors.forEach(function(floor, n){
      if (floor.plan) {
        var img = document.createElement('img');
        img.classList.add('plan');
        // img.classList.add('active');
        img.src = [
          parent.location.origin,
          parent.location.pathname,
          floor.plan.imageUrl
        ].join('/');
        img.style.transform = 'translate(0px, 0px)'; //todo

        if(floor.plan.width) img.width = floor.plan.width;
        if(floor.plan.height) img.height = floor.plan.height;

        floors.plans.appendChild(img);
      }
    })
  },
  showFloor: function(n){
    Array.from(this.plans.children).forEach(function(plan, i){
      plan.classList[n==i?'add':'remove']('active')
    })
    if(n != undefined){
      this.active = n;
      menu.items.floor.items.selectFloor.value = n+'';
    }
    camera.draw();
    camera.draw();
    links.draw();
  },
  setPosition: function(){
    this.plans.style.transform = 'translate('+camera.x+'px, '+camera.y+'px) scale('+camera.scale+')';
  }
}

var links = {
  init: function(){
    this.domElement = document.querySelector('.connections-layer');
    this.debounceDraw = debounce(this.draw, 200)
  },
  hide: function(){
    this.domElement.classList.add('hidden');
  },
  setPoints: function(){
    while(connectiPoints.length){
      connectiPoints[0].remove();
    }
    points.forEach(function(point){
      if(point.panorama.links)point.panorama.links.forEach(function(link){
        if(point.panorama.id > link.id && link.x!=undefined && link.y!=undefined){
          new ConnectiPoint(link, [link, utils.findPoinnt(link.id).panorama.links.find(function(l){return l.id == point.panorama.id})]);
        }
      })
    })
  },
  draw: function(){
    this.domElement.innerHTML = '';
    points.forEach(function(point){
      if(point.visible && point.panorama.links && point.panorama.links.length){
        point.panorama.links.forEach(function(link){
          var a = point;
          var b = utils.findPoinnt(link.id);
          var linkA = link;
          var linkB = b.panorama.links.find(function(l){return l.id == a.panorama.id});
          if(a.panorama.id < b.panorama.id || linkA.x!=undefined || linkB.x !=undefined){
            var aPosition = a.getAbsolutePosition();
            var bPosition = (linkB.x!=undefined)? camera.toAbsolutePosition(linkB) : b.getAbsolutePosition();

            var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            // line.title = '123'
            line.setAttribute("x1", aPosition.x);
            line.setAttribute("y1", aPosition.y);
            line.setAttribute("x2", bPosition.x);
            line.setAttribute("y2", bPosition.y);

            if(a.panorama.floor !== b.panorama.floor){
              line.setAttribute("stroke-dasharray", "5, 5");
            }

            var linkPoint = linkA.x != undefined && linkA.y != undefined && linkB.x != undefined && linkB.y != undefined

            if(linkPoint){
              if(linkA.hidePoint)line.classList.add("secondary");
            }else{
              if(linkA.hidePoint || linkA.hidePoint)line.classList.add("secondary");
            }


            line.addEventListener('mousedown', function(event){
              event.stopPropagation();
              if(event.which == 3){
                a.panorama.links.splice(a.panorama.links.indexOf(linkA), 1);
                b.panorama.links.splice(b.panorama.links.indexOf(linkB), 1);
                links.setPoints();
                toasts.push('The link has been removed')
              }else if(event.which == 1){
                if(linkPoint){
                  linkA.hidePoint = !linkA.hidePoint;
                }else{
                  linkA.hidePoint = linkB.hidePoint = !linkA.hidePoint;
                }
              }
              links.draw();
              state.save();
            });
            links.domElement.appendChild(line);


            // CIRCLE:
            // <circle cx="4" cy="4" r="4" fill="#0066FF"/>
            if(linkA.x==undefined && linkB.x ==undefined){
              var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              circle.setAttribute("cx", (aPosition.x + bPosition.x) / 2); // temp
              circle.setAttribute("cy", (aPosition.y + bPosition.y) / 2); // temp
              circle.setAttribute("r", '4');
              circle.addEventListener('mousedown', function(event){
                event.stopPropagation();
                new ConnectiPoint(event, [linkA, linkB]);
              })
              links.domElement.appendChild(circle);
            }

          }
        })
      }
    })
    this.domElement.classList.remove('hidden');
    camera.updateLinks();
  }
}


window.addEventListener('load', init);
