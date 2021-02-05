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
      staus.set();
      this.current.lastModified = Date.now();
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
      camera.lookAt(startView || activePoint);
      this.firstLoad = false;
    }

    Tour.setPanorama(Tour.view.id);
    properties.set();
    camera.draw();
    areas.set();
    map.set();
    links.setPoints();
    links.draw();
    globalTab.set()
    staus.set();
    markers.set();
  },
  get: function(){
    this.name = Tour.data.name || prompt('project name:', Tour.data.title || 'myProject');
    // this.name = this.name || prompt('project name:', 'myProject');
    this.current = localStorage[this.name]? JSON.parse(localStorage[this.name]) : Tour.data;
    if(Tour.data.lastModified > this.current.lastModified){
      var a = Object.assign({}, Tour.data);
      var b = Object.assign({}, this.current);
      a.lastModified = b.lastModified = 0;
      var diff = JSON.stringify(a) != JSON.stringify(b)
      if(diff && confirm(
`File ${Tour.defaultOption.manifest} has been modified and is more recent than its local version to.
localStorage — ${new Date(this.current.lastModified).toLocaleString()}
${Tour.defaultOption.manifest} — ${new Date(Tour.data.lastModified).toLocaleString()}
Use a more recent file?`)){
        this.current = Tour.data
      }
    }
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
    a.download    = this.name+' '+dateStr+".json";
    a.href        = url;
    a.textContent = a.download;
    a.click()
  },
  saveToServer: function(){
    if(confirm('Update '+parent.Tour.options.manifest+' file?')){
      toasts.push("Saving...");
      fetch('/server/save', { method: "POST", headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify({
        manifest: parent.Tour.options.manifest,
        password: '1',
        tour: this.current
      })}).then(response => {
        return response.json().catch(error => {
          throw `JSON Parse error: ${error}`;
        });
      }).then(json => {
        if (json.success) {
          toasts.push("Save success");
        } else {
          throw "Save fail"
        }
      }).catch(error => {
        toasts.push(error);
      });
    }
  }
};

function getAreaPreView(area, callback){
  var size = 1024
  var alpha = size/42
  var pano = Tour.getPanorama(area.view.id)
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 130, 1, 1, 1100);
  var geometry = new THREE.SphereBufferGeometry( size, 32, 32 );
  geometry.scale( - 1, 1, 1 );
  var texture = new THREE.TextureLoader().load( 'panorams/'+area.view.id+'/thumbnail/equidistant.jpg', function(){
    var phi = THREE.Math.degToRad(90 - area.view.lat);
    var theta = THREE.Math.degToRad(90-area.view.lon+(90-(pano.heading||0)));
    var target = new THREE.Vector3();
    target.x = Math.sin(phi) * Math.cos(theta);
    target.y = Math.cos(phi);
    target.z = Math.sin(phi) * Math.sin(theta);

    camera.lookAt(target);
    camera.updateProjectionMatrix();
    renderer.render( scene, camera );

    var flatX = [];
    var flatY = [];
    var points = area.points.forEach(function(cord){
      flatX.push((size/2)+cord[0]*alpha);
      flatY.push((size/2)-cord[1]*alpha);
    })
    var vx = Math.min.apply(null, flatX);
    var vy = Math.min.apply(null, flatY);
    var vw = Math.max.apply(null, flatX)-vx;
    var vh = Math.max.apply(null, flatY)-vy;

    var canvas = document.createElement('canvas');
    canvas.width = vw
    canvas.height = vh
    var ctx = canvas.getContext('2d');
    ctx.drawImage(renderer.domElement, vx, vy, vw, vh, 0, 0, vw, vh)

    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    area.points.forEach(function(cord, n){
      ctx[n==0?'moveTo': 'lineTo']((size/2)+cord[0]*alpha-vx, (size/2)-cord[1]*alpha-vy)
    })
    ctx.fill();

    callback(canvas.toDataURL());
  });
  var material = new THREE.MeshBasicMaterial( { map: texture } );
  var mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );
  var renderer = new THREE.WebGLRenderer({});
  renderer.setSize( size, size );
}

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
    links.hide();
    links.debounceDraw();
    map.domElement.style.imageRendering = this.scale>(42/100)?'pixelated':'auto';
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
    if (event.code == 'KeyS' && (event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey){
      event.preventDefault();
      state.saveAsFile()
    }
    if (event.code == 'KeyS' && (event.ctrlKey || event.metaKey) && event.altKey){
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
    if (event.code == 'Backspace'){
      event.preventDefault();
      utils.deleteSelectedPanoramas()
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

var staus = {
  setValue: function(key, value){
    document.querySelector('.global .st-'+key).innerText = value;
  },
  set:function(){
    this.setValue('panorams', state.current.panorams.length);
    this.setValue('links', state.current.panorams.reduce((s, item) => s + (item?.links?.length || 0), 0)/2);
    this.setValue('areas', state.current.panorams.reduce((s, item) => s + (item?.areas?.length || 0), 0));
    var width = Math.abs(Math.min(...state.current.panorams.map(item => item.x))-Math.max(...state.current.panorams.map(item => item.x)))
    var height = Math.abs(Math.min(...state.current.panorams.map(item => item.y))-Math.max(...state.current.panorams.map(item => item.y)))
    this.setValue('width', (width/100).toFixed(1)+'m');
    this.setValue('height', (height/100).toFixed(1)+'m');
    this.setValue('square', (height/100 * width/100).toFixed(1)+'m²');
    this.setPerformance();
  },
  setPerformance: function(){
    var memory = document.querySelector('.performance-memory');
    memory.value = performance.memory.usedJSHeapSize/1024/1204;
    memory.secondaryValue = performance.memory.totalJSHeapSize/1024/1204;
    memory.max = performance.memory.jsHeapSizeLimit/1024/1204;

    var storage = document.querySelector('.performance-storage');
    storage.value = Object.keys(localStorage).map(key => localStorage[key]).join('').length/1024;
    storage.max = 5200000/1024;

  }
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

Point.prototype.removeLinks = function(){
  var removeFlag = false;
  var that = this
  if(this.panorama.links && this.panorama.links.length)this.panorama.links.forEach(function(p){
    removeFlag = true;
    var panorama = utils.findPoinnt(p.id).panorama;
    panorama.links = panorama.links.filter(function(n){
      return n.id != that.panorama.id;
    })
  })
  this.panorama.links = [];
  return removeFlag
}


Point.prototype.remove = function(){
  this.removeLinks();
  this.select(false);
  map.pointsElement.removeChild(this.domElement);
  state.current.panorams.splice(state.current.panorams.indexOf(this.panorama), 1);
  points.splice(points.indexOf(this), 1);
  delete this
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
  if (Tour.view.id == this.panorama.id) {
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
  globalTab.init();
  floors.init()
  markers.init()
  map.init()
  camera.update();
  links.init();
  properties.init()
  areas.init();
  state.get();
  select.init();
  areaEditor.init()
  //links.setPoints()

  Tour.defaultOption.limit = Tour.options.limit = {
    fov: { min: 15, max: 150},
    lat: { min: -85, max: 85},
    lon: { min: false, max: false}
  }


  window.onbeforeunload = state.save.bind(state);
}

var markers = {
  init: function(){
    this.listElement = document.querySelector('.markers-list');
    Tour.on('changePano', markers.set.bind(markers));
  },
  set: function(){
    this.listElement.innerHTML = '';
    var markers = Tour.getPanorama().markers;
    if(markers && markers.length){
      markers.forEach(function(marker){
        var element = document.createElement('marker-item');
        element.icon = 'info';
        element.title = marker.title;
        element.id = marker.action.id;
        console.log(marker)
        this.listElement.appendChild(element);
      }.bind(this))
    }
  }
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
        input.setAttribute('status', warning?'warning':'');

        var img = [
          parent.location.origin,
          parent.location.pathname,
          'panorams',
          point.panorama.id,
          'thumbnail/mini.jpg'
        ].join('/');

        document.querySelector('.preview').style.backgroundImage = `url('${img}')`
      })
    }else{
      this.inputs.forEach(function(input){
        input.value = '';
        input.setAttribute('status', '');
      })
    }
  },
  onChange: function(event){
    var input = event.target;
    var key = input.getAttribute('data-key');
    var type = input.getAttribute('data-type');
    var value = input.value;

    if(input.getAttribute('type') == 'number'){
      value = parseFloat(value)
    }

    this.setPointsValue(key, value);
    links.draw();
    state.save();
  },
  init: function(){
    this.inputs = document.querySelectorAll('.properties *[data-key]');
    var that = this;
    this.inputs.forEach(function(input){
      input.addEventListener('change', that.onChange.bind(that));
    })
  }
}

var globalTab = {
  onChange: function(event){
    var input = event.target;
    var key = input.getAttribute('data-key');
    var type = input.getAttribute('data-type');
    var value = input.value;

    if(input.getAttribute('type') == 'number'){
      value = parseFloat(value)
    }

    state.current[key] = value;
    state.save();
  },
  init: function(){
    this.inputs = document.querySelectorAll('.global *[data-key]');
    var that = this;
    this.inputs.forEach(function(input){
      input.addEventListener('change', that.onChange.bind(that));
    })
  },
  set: function(){
    this.inputs.forEach(function(input){
      var key = input.getAttribute('data-key');
      input.value = state.current[key];
    })
  }
}

// var Area = function(){

// }

var areaCache = {}

areas = {
  init: function(){
    this.domElement = document.querySelector('.area-list');
    Tour.on('changePano', areas.set.bind(areas));
    this.set();
    parent.addEventListener('keydown', function(event){
        if (event.code == 'KeyA' && !event.ctrlKey && !event.metaKey){
          event.preventDefault();
          areaEditor.toggle()
        }
        if (event.code == 'Enter' && !event.ctrlKey && !event.metaKey){
          areaEditor.save();
        }
        if (event.code == 'Escape' && areaEditor.drawMode){
          areaEditor.show(false);
        }
    })
  },
  set: function(){
    console.log('set')
    areas.domElement.innerHTML = '';
    var pano = Tour.getPanorama(Tour.view.id)
    if(pano.areas)pano.areas.forEach(function(area, n){
      var areaItem = document.createElement('area-item');
      areaItem.id = area.id;
      areaItem.title = area.title || '';


      // var flatX = [];
      // var flatY = [];
      // var points = 'M'+area.points.map(function(cord){
      //   flatX.push(cord[0]);
      //   flatY.push(-cord[1]);
      //   return [cord[0], -cord[1]].join(' ');
      // }).join('L')+'Z';
      // var vx = Math.min.apply(null, flatX);
      // var vy = Math.min.apply(null, flatY);
      // var vw = Math.max.apply(null, flatX);
      // var vh = Math.max.apply(null, flatY);

      // var viewBox = [vx, vy, vw-vx, vh-vy].join(' ');
      var setArea = function(e){
        area.id = e.target.id;
        area.title = e.target.title;
        Tour.areasManager.set()
        state.save()
      }
      areaItem.addEventListener('changeId', setArea);
      areaItem.addEventListener('changeTitle', setArea);
      areaItem.addEventListener('click', function(){
        Tour.view.set(area.view);
         areaEditor.show(false);
      });
      areaItem.addEventListener('dblclick', function(){
        areaEditor.edit(area);
      });
      areaItem.addEventListener('delete', function(){
        // areaEditor.show(false);
        pano.areas.splice(n, 1);
        Tour.areasManager.set();
        state.save();
        areas.domElement.removeChild(areaItem);
      });

      var key = JSON.stringify(area);

      if(areaCache[key]){
        areaItem.image = areaCache[key]
      }else{
        getAreaPreView(area, function(url){
          areaItem.image = url;
          areaCache[key] = url;
        })
      }

      // areaItem.image="data:image/svg+xml,%3Csvg viewBox='"+viewBox+"' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='"+points+"' fill='%23C4C4C4'/%3E%3C/svg%3E%0A"
      areas.domElement.appendChild(areaItem);
    })
  }
}


AreaIntermediatePoint = function(index){
  this.x = 0;
  this.y = 0;
  this.index = index;

  this.domElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  areaEditor.intermediatePointsGroupElement.appendChild(this.domElement);

  this.onMouseDown = this.mouseDown.bind(this);
  this.domElement.addEventListener('mousedown', this.onMouseDown);
}

AreaIntermediatePoint.prototype.draw = function(){
  var absolute = areaEditor.areaToAbsolute(this)
  this.domElement.setAttribute('x', absolute.x);
  this.domElement.setAttribute('y', absolute.y);
}

AreaIntermediatePoint.prototype.mouseDown = function(event){
  event.stopPropagation()
  var point = new AreaPoint(this);
  areaEditor.points.splice(this.index+1, 0, point);
  areaEditor.set();
  point.mouseDown(event);
}

AreaIntermediatePoint.prototype.remove = function(){
  areaEditor.intermediatePointsGroupElement.removeChild(this.domElement);
  areaEditor.rootElement.removeEventListener('mousedown', this.onMouseDown);
}


AreaPoint = function(vector){
  this.x = vector.x;
  this.y = vector.y;
  this.domElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  areaEditor.pointsGroupElement.appendChild(this.domElement);
  this.mouse = {x:0, y:0};


  this.onMouseMove = this.mouseMove.bind(this);
  this.onMouseUp = this.mouseUp.bind(this);
  this.onMouseDown = this.mouseDown.bind(this);
  this.domElement.addEventListener('mousedown', this.onMouseDown);
}

AreaPoint.prototype.mouseDown = function(event){
  event.stopPropagation()
  if(event.which == 1){
    var area = areaEditor.areaToAbsolute(this);
    this.mouse.x = event.pageX - area.x;
    this.mouse.y = event.pageY - area.y;
    areaEditor.rootElement.addEventListener('mousemove', this.onMouseMove);
    areaEditor.rootElement.addEventListener('mouseup', this.onMouseUp);
    areaEditor.rootElement.classList.add('active');
  }else{
    this.remove();
    areaEditor.set();
  }
}

AreaPoint.prototype.mouseMove = function(event){
  var absolute = areaEditor.absoluteToArea({x: event.pageX - this.mouse.x, y:event.pageY - this.mouse.y})
  this.x = absolute.x;
  this.y = absolute.y;
  areaEditor.draw();
  this.draw();
}

AreaPoint.prototype.mouseUp = function(){
  areaEditor.rootElement.removeEventListener('mousemove', this.onMouseMove);
  areaEditor.rootElement.removeEventListener('mouseup', this.onMouseUp);
  areaEditor.rootElement.classList.remove('active');
}

AreaPoint.prototype.draw = function(){
  var absolute = areaEditor.areaToAbsolute(this)
  this.domElement.setAttribute('x', absolute.x);
  this.domElement.setAttribute('y', absolute.y);
}

AreaPoint.prototype.remove = function(n){
  areaEditor.pointsGroupElement.removeChild(this.domElement);
  if(!n)areaEditor.points.splice(areaEditor.points.indexOf(this), 1);
  areaEditor.rootElement.removeEventListener('mousedown', this.onMouseDown);
}

var areaEditor = {
  drawMode: false
}

areaEditor.init = function(){
  this.points = [];
  this.intermediatePoints = [];

  this.rootElement = document.createElement('div');
  this.rootElement.classList.add('areaEditor');

  this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  this.style = document.createElement('style');
  this.style.innerHTML = `
  :root {
      --accent: #08F;
      --error: #F00;
  }

  .areaEditor{
    width: 100%;
    height: 100%;
    display: none;
    position: absolute;
    cursor: crosshair;
  }

  .areaEditor.active {
    cursor: grabbing;
  }

  .areaEditor.drawing{
    display: block;
  }

  path.background{
    fill-rule: evenodd;
    fill: black;
    fill-opacity: 0.25;
  }

  path.area{
    fill-rule: nonzero;
    fill: var(--accent);
    fill-opacity: 0.25;
    stroke: var(--accent);
    stroke-width: 1px;
  }

  rect {
    width: 6px;
    height: 6px;
    transform: translate(-3px, -3px);
    fill: white;
    stroke: var(--accent);
    stroke-width: 1px;
  }

  .areaEditor:not(.active) rect{
    cursor: grab;
  }

  .intermediatePoints rect{
    width: 4px;
    height: 4px;
    transform: translate(-2px, -2px);
    fill: var(--accent);
  }


  .areaEditor.error path.area{
    fill: var(--error);
    stroke: var(--error);
  }

  .areaEditor.error .intermediatePoints rect{
    fill: var(--error);
  }
  .areaEditor.error rect{
    stroke: var(--error);
  }

  `

  this.backgroundElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
  this.backgroundElement.classList.add('background');
  this.areaElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
  this.areaElement.classList.add('area');

  this.pointsGroupElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
  this.pointsGroupElement.classList.add('points');
  this.intermediatePointsGroupElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
  this.intermediatePointsGroupElement.classList.add('intermediatePoints');


  this.svgElement.appendChild(this.backgroundElement);
  this.svgElement.appendChild(this.areaElement);
  this.svgElement.appendChild(this.pointsGroupElement);
  this.svgElement.appendChild(this.intermediatePointsGroupElement);

  this.rootElement.appendChild(this.style);
  this.rootElement.appendChild(this.svgElement);
  Tour.domElement.appendChild(this.rootElement);

  this.onMouseDown = this.push.bind(this);
  this.rootElement.addEventListener('mousedown', this.onMouseDown);
  this.rootElement.addEventListener('contextmenu', function(event){
    event.preventDefault();
    event.stopPropagation();
  });

  parent.addEventListener('resize', function(){
    if(this.drawMode){
      this.set();
    }
  }.bind(this));

  this.set();
}

areaEditor.edit = function(area){
  Tour.view.set(area.view);
  this.show(true);
  this.set(area.points);
  this.editArea = area;
}

areaEditor.show = function(value){
  console.log(this.drawMode , value)
  if(this.drawMode && !value){
    var edit = !this.editArea || (JSON.stringify(this.editArea.points) != JSON.stringify(this.points.map(function(peak){
        return [parseFloat(peak.x.toFixed(3)), parseFloat(peak.y.toFixed(3))]
    })))
    if(this.points.length >= 3 && edit && parent.confirm('Save area?')){
      areaEditor.save();
    }
    areaEditor.set([]);
  }
  if(!value){
    this.editArea = false;
  }
  this.drawMode = value;
  this.rootElement.classList[this.drawMode?'add':'remove']('drawing')
}

areaEditor.toggle = function(){
  areaEditor.show(!this.drawMode);
}

areaEditor.set = function(points){


    // var vFOV = THREE.Math.degToRad( Tour.camera.fov );
    // var height = 2 * Math.tan( vFOV / 2 ) * dist;
    // var width = height * Tour.camera.aspect;

    // var geometry = new THREE.PlaneGeometry(width, height);
    // var material = new THREE.MeshBasicMaterial( {color: 0x000000, transparent: true} );
    // material.opacity = 0.2;
    var dist = 10
    this.plane = new THREE.Object3D();

    var vector = new THREE.Vector3(0, 0, -1);
    vector.applyEuler(Tour.camera.rotation, Tour.camera.rotation.order);
    this.plane.position.set(vector.x*dist, vector.y*dist, vector.z*dist);
    this.plane.lookAt(Tour.camera.position)
    console.log(this.plane)


  ///
  this.intermediatePoints.forEach(function(intermediatePoint){
    intermediatePoint.remove();
    delete intermediatePoint;
  })

  if(points){
    this.points.forEach(function(point){
      point.remove(true);
      delete point;
    })

    this.points = points.map(function(point){
      return new AreaPoint({x:point[0], y:point[1]})
    });
  }
  this.intermediatePoints = this.points.map(function(point, index){
    return new AreaIntermediatePoint(index);
  });
  this.svgElement.setAttribute('viewBox', [0, 0, opener.innerWidth, opener.innerHeight].join(' '));
  this.draw(true);
}

var lineSegmentsIntersect = (x1, y1, x2, y2, x3, y3, x4, y4)=> {
    var a_dx = x2 - x1;
    var a_dy = y2 - y1;
    var b_dx = x4 - x3;
    var b_dy = y4 - y3;
    var s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
    var t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
    return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
}

areaEditor.draw = function(force){
  var rect = 'M'+opener.innerWidth+' 0H0V'+opener.innerHeight+'H'+opener.innerWidth+'V0Z';


  // function isIntersecting(p1, p2, p3, p4) {
  //   function CCW(p1, p2, p3) {
  //       return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
  //   }
  //   return (CCW(p1, p3, p4) != CCW(p2, p3, p4)) && (CCW(p1, p2, p3) != CCW(p1, p2, p4));
  // }

  var intersect = false;

  var points = this.points.concat([this.points[0]])

  for(var i=1; i<points.length; i++){
    var a = points[i-1]
    var b = points[i]
    for(var j=1; j<points.length; j++){
      var c = points[j-1]
      var d = points[j];
      var end = (i==1 && j==points.length-1) || (j==1 && i==points.length-1)
      intersect = (i!=j && i != j-1 && j != i-1 && !end && lineSegmentsIntersect(a.x, a.y, b.x, b.y, c.x, c.y, d.x, d.y)) || intersect;
    }
  }

  var shape = this.points.length?'M'+this.points.map(function(point){
    if(force)point.draw();
    var absolute = areaEditor.areaToAbsolute(point)
    return [absolute.x, absolute.y].join(' ');
  }).join('L')+'Z':'';
  this.intermediatePoints.forEach(function(point, n){
    var index = n!=areaEditor.points.length-1?n+1:0;
    point.x = (areaEditor.points[n].x+areaEditor.points[index].x)/2
    point.y = (areaEditor.points[n].y+areaEditor.points[index].y)/2
    point.draw();
  })
  this.backgroundElement.setAttribute('d', rect+shape);
  this.areaElement.setAttribute('d', shape);
  this.rootElement.classList[intersect?'add':'remove']('error')
}

areaEditor.absoluteToArea = function(vector){
  var d = 10
  var w = parent.innerWidth;
  var h = parent.innerHeight;
  var a = Math.tan(THREE.Math.degToRad(Tour.view.fov.value)/2)

  return {
    x: (vector.x - w/2)/(w/2) * w/h *d * a,
    y: (vector.y - h/2)/(h/-2) * d * a
  }
}

areaEditor.areaToAbsolute = function(vector){
  var d = 10
  var w = parent.innerWidth;
  var h = parent.innerHeight;
  var a = THREE.Math.radToDeg(Math.atan(Tour.view.fov.value)*2)
  var a = Math.tan(THREE.Math.degToRad(Tour.view.fov.value)/2)

  return {
    x: ((vector.x / a / d / (w/h))/2 + 1/2) * w,
    y: ((vector.y / a / d)/-2 + 1/2) * h
  }
}

areaEditor.push = function(event){
  if(event.which == 1){
    this.points.push(new AreaPoint(areaEditor.absoluteToArea({x:event.pageX, y:event.pageY})));
    this.set();
  }
}

areaEditor.save = function(){
  if(this.points.length && this.drawMode){
    var panorama = Tour.getPanorama();
    var defaultid = panorama?.areas?.slice(-1)[0]?.id
    var id = this.editArea || parent.prompt('Enter popup id', defaultid? parseInt(defaultid)+1: 0)
    var view = Tour.view.get()
    var area = {
        action: {},
        id: id,
        view: view,
        points: this.points.map(function(peak){
            return [parseFloat(peak.x.toFixed(3)), parseFloat(peak.y.toFixed(3))]
        }),
        rotation: [
            parseFloat(this.plane.rotation.x.toFixed(3)),
            parseFloat(this.plane.rotation.y.toFixed(3)),
            parseFloat(this.plane.rotation.z.toFixed(3))
        ],
        position: [
            parseFloat(this.plane.position.x.toFixed(3)),
            parseFloat(this.plane.position.y.toFixed(3)),
            parseFloat(this.plane.position.z.toFixed(3))
        ]
    }

    if(! panorama.areas){
        panorama.areas = [];
    }
    if(areaEditor.editArea){
      areaEditor.editArea.points = area.points;
    }else{
      panorama.areas.push(area);
    }

    Tour.areasManager.set();
    state.save();
    areas.set();
    this.set([]);
    this.show(false);
  }
}


// areaEditor = {
//     drawMode: false
// }

// areaEditor.set = function() {
//     UI.notification.show('Draw mode on', 300);
//     Tour.renderer.domElement.style.pointerEvents = 'none'
//     Tour.domElement.style.cursor = 'crosshair'
//     UI.controlPanel.visibility = true; Tour.controls.toggleMenu();

//     var dist = 10

//     var vFOV = THREE.Math.degToRad( Tour.camera.fov );
//     var height = 2 * Math.tan( vFOV / 2 ) * dist;
//     var width = height * Tour.camera.aspect;

//     var geometry = new THREE.PlaneGeometry(width, height);
//     var material = new THREE.MeshBasicMaterial( {color: 0x000000, transparent: true} );
//     material.opacity = 0.2;
//     this.plane = new THREE.Mesh( geometry, material );

//     var vector = new THREE.Vector3(0, 0, -1);
//     vector.applyEuler(Tour.camera.rotation, Tour.camera.rotation.order);
//     this.plane.position.set(vector.x*dist, vector.y*dist, vector.z*dist);
//     this.plane.lookAt(Tour.camera.position)
//     Tour.scene.add( this.plane );


//     var geometry = new THREE.ShapeGeometry( new THREE.Shape() );
//     var material = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true} );
//     material.opacity = 0.6;
//     this.mesh = new THREE.Mesh( geometry, material ) ;
//     this.mesh.rotation.copy(this.plane.rotation);
//     this.mesh.position.copy(this.plane.position);
//     Tour.scene.add( this.mesh );

//     this.points = [];
//     this.peaks = [];

//     this.mouseupUpEvent = this.mouseup.bind(this);
//     this.mousemoveEvent = this.mousemove.bind(this);
//     this.keyDownEvent = this.keyDown.bind(this);

//     parent.addEventListener('mouseup', this.mouseupUpEvent);
//     parent.addEventListener('mousemove', this.mousemoveEvent);
//     parent.addEventListener('keydown', this.keyDownEvent);
// }

// areaEditor.keyDown = function(event) {
//     switch (event.code) {
//         // case 'Slash': this.copyAll(); break;
//     }
// }

// areaEditor.save = function(){
//     var panorama = Tour.getPanorama();
//     var defaultid = panorama.areas && panorama.areas.slice(-1)[0] && panorama.areas.slice(-1)[0].id
//     var id = parent.prompt('Enter popup id', defaultid? parseInt(defaultid)+1: 0);
//     var view = Tour.view.get()
//     var area = {
//         action: {},
//         id: id,
//         view: view,
//         points: this.peaks.map(function(peak){
//             return [parseFloat(peak.x.toFixed(3)), parseFloat(peak.y.toFixed(3))]
//         }),
//         rotation: [
//             parseFloat(this.plane.rotation.x.toFixed(3)),
//             parseFloat(this.plane.rotation.y.toFixed(3)),
//             parseFloat(this.plane.rotation.z.toFixed(3))
//         ],
//         position: [
//             parseFloat(this.plane.position.x.toFixed(3)),
//             parseFloat(this.plane.position.y.toFixed(3)),
//             parseFloat(this.plane.position.z.toFixed(3))
//         ]
//     }

//     if(! panorama.areas){
//         panorama.areas = [];
//     }
//     panorama.areas.push(area);
//     Tour.areasManager.set();
//     state.save()
//     areas.set();
// }

// areaEditor.mouseup = function(event){
//     if(Tour.domElement.style.cursor === 'copy'){
//         this.save();
//         this.init();
//     }else{
//         this.peaks.push(this.getVector(event))
//         this.draw();
//     }
// }

// areaEditor.getVector = function(event){
//     var mouse = new THREE.Vector2();
//     mouse.x = (event.clientX / parent.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / parent.innerHeight) * 2 + 1;
//     var raycaster = new THREE.Raycaster();
//     raycaster.setFromCamera(mouse, Tour.camera);
//     var intersects = raycaster.intersectObject(this.plane);
//     var vector = new THREE.Vector3().copy( intersects[ 0 ].point );
//     intersects[ 0 ].object.worldToLocal( vector );
//     return vector;
// }


// areaEditor.mousemove = function(event){
//     var vector = this.getVector(event)
//     if(this.peaks[0] && Math.sqrt(Math.pow(Math.abs(vector.x - this.peaks[0].x), 2) + Math.abs(vector.y - this.peaks[0].y)) < 0.2){
//         Tour.domElement.style.cursor = 'copy'
//         this.points = this.peaks.concat();
//     }else{
//         Tour.domElement.style.cursor = 'crosshair'
//         this.points = this.peaks.concat([vector]);
//     }
//     this.draw();
// }

// areaEditor.draw = function(){
//     if(this.points.length >= 3){
//         var shape = new THREE.Shape();
//         shape.moveTo(this.points[0].x, this.points[0].y);

//         for(var i=1; i<this.points.length; i++){
//             shape.lineTo(this.points[i].x, this.points[i].y);
//         }
//         shape.lineTo(this.points[0].x, this.points[0].y);

//         this.mesh.geometry = new THREE.ShapeGeometry( shape );
//         Tour.needsUpdate = true;
//     }
// }

// areaEditor.clear = function() {
//     Tour.renderer.domElement.style.pointerEvents = Tour.domElement.style.cursor = 'initial'
//     Tour.scene.remove(this.plane);
//     Tour.scene.remove(this.mesh);

//     parent.removeEventListener('mouseup', this.mouseupUpEvent);
//     parent.removeEventListener('mousemove', this.mousemoveEvent);
//     parent.removeEventListener('keydown', this.keyDownEvent)
// }

// areaEditor.init = function() {
//     this.drawMode = !this.drawMode;
//     this.drawMode? this.set() : this.clear();
//     Tour.needsUpdate = true;
//     // parent.focus()
// }

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

  generateNadirMap: function(){
    this.nadirMap = window.open(
      'nadirMap.html',
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
  },
  addPanorams: function(){
    var start = parseInt(prompt('start id', parseInt(state.current.panorams.slice(-1)[0].id)+1))
    var end = parseInt(prompt('end id', start));
    var position = camera.getView()
    for (var i=start; i<=end; i++){
      state.current.panorams.push({
        id: i+'',
        heightFromFloor: 154,
        heading: 0,
        x: position.x,
        y: position.y,
        floor: floors.active,
        markers: [],
        title: i+''
      })
    }
    state.save();
    state.set();
    for (var i=start; i<=end; i++){
      utils.findPoinnt(i+'').select(true);
    }
    utils.showActivePoint();
    utils.alignSelectedPoints()
  },
  addPanorama: function(){
    var id = prompt('panorama id', parseInt(state.current.panorams.slice(-1)[0].id)+1);
    var position = camera.getView()
    state.current.panorams.push({
      id: id,
      heightFromFloor: 154,
      heading: 0,
      x: position.x,
      y: position.y,
      floor: floors.active,
      markers: [],
      title: id
    })
    state.save();
    state.set();
    utils.findPoinnt(id).select(true);
    utils.showActivePoint()
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
    globalTab.set();
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
  deleteSelectedPanoramas(){
    if(select.points.length){
      var filter = select.points.filter(function(point){
        return Tour.view.id != point.panorama.id
      })
      if(filter.length){
        filter.forEach(function(point){
          point.remove();
        })
        links.draw();
        links.setPoints();
        state.save();
        properties.set()
        toasts.push('Selected points have been deleted')
      }else{
        toasts.push("Can't delete viewpoint")
      }
    }else{
      toasts.push('No points selected');
    }
  },
  removeAllLinks: function(){
    var removeFlag = false;
    if(select.points.length){
      select.points.forEach(function(point){
        removeFlag = point.removeLinks() || removeFlag
      })
      if(removeFlag){
        state.save()
        links.draw();
        links.setPoints()
        toasts.push('Аll links have been removed for selected points');
      }else{
        toasts.push('Selected points have no links')
      }
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
        ].join('');
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
