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
  count: 0,
  name: null,
  states: [],

  push: function(code){
    this.states[this.count] = code;
    this.count = this.states.length;
  },
  getCode: function(format){
    return JSON.stringify(this.current, null, format && 2);
  },
  save: function(){
    var code = this.getCode();
    localStorage[this.name] = code;
    this.push(code);
  },
  set: function(){
    points = [];
    map.pointsElement.innerHTML = '';
    Tour.data = this.current;
    //slice(0,100)
    this.current.panorams.forEach(function(pano){
      var point = new Point(pano);
      point.draw(true);
      points.push(point);
    })
    Tour.setPanorama(Tour.view.id);
  },
  get: function(){
    this.name = this.name || localStorage.projectName || prompt('project name:', 'myProject');
    this.current = localStorage[this.name]? JSON.parse(localStorage[this.name]) : Tour.data;
    localStorage.projectName = this.current.name = this.name;
    if(!this.current.floors){
      this.current.floors = [
        {height: 400, title:'Lower lavel (garage)', plan: null },
        // plan: {imageURL: '../floors/0.svg', x:0, y:0, width:6830.492121379737}
      ]
    }
    this.set()
    return this.current;
  },
  undo: function(){
    this.current = JSON.parse(this.states[--this.count]);
    this.set();
  },
  redo: function(){

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
    if(position.floor != undefined && position.floor != floors.active){
      floors.showFloor(Math.floor(position.floor))
    }
    this.draw();
  },
  getView: function(){
    return {
      x: -(this.x-this.width/2)/this.scale,
      y: -(this.y-this.height/2)/this.scale
    }
  },
  setScale: function(scale){
    var view = camera.getView();
    this.scale = Math.max(0.1, Math.min(1.68, scale));
    this.lookAt(view);
    links.hide()
    links.debounceDraw()
  },
  draw: function(){
    // map.domElement.style.backgroundPosition = this.x+'px '+this.y+'px';
    map.domElement.style.setProperty('--scale', this.scale*(100/42));
    map.domElement.style.setProperty('--offset-x', this.x+'px');
    map.domElement.style.setProperty('--offset-y', this.y+'px');
    points.forEach(function(point){
      point.setPosition(true);
    })
    map.setFov();
    floors.setPosition()
  },
  fovChange: function(e){
    this.fovPoint =  utils.findPoinnt(e.id);
    map.setFov();
  }
}

var map = {
  start: {x: 0, y:0},
  mouse: {x: 0, y:0},
  init: function(){
    this.domElement = document.querySelector('.map');
    this.pointsElement = document.querySelector('.points');
    this.fovElement = document.querySelector('.point-fov');
    this.fovCTX = this.fovElement.getContext('2d');
    this.onMouseMove = this.mouseMove.bind(this);
    this.onMouseUp = this.mouseUp.bind(this);
    this.onMouseDown = this.mouseDown.bind(this);

    this.domElement.addEventListener('mousedown', this.onMouseDown);
    this.domElement.addEventListener('mousewheel', this.mouseWheel)
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
    if (event.code == 'KeyF' && (event.ctrlKey || event.metaKey) && !event.shiftKey){
      event.preventDefault();
      utils.findAndShowPoint();
    }
    if (event.code == 'KeyF' && (event.ctrlKey || event.metaKey) && event.shiftKey){
      event.preventDefault();
      utils.findAndMovePoint();
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

  this.onMouseDownRotate = this.mouseDownRotate.bind(this);
  this.onMouseMoveRotate = this.mouseMoveRotate.bind(this);
  this.onMouseUpRotate = this.mouseUpRotate.bind(this);

  this.domElement.addEventListener('mousedown', this.onMouseDown);
  this.rotateElement.addEventListener('mousedown', this.onMouseDownRotate);
}

Point.prototype.select = function(value, invert){
  var selected = (invert&&this.selected==value)? !value : value;
  if(selected && !this.selected){
    this.domElement.classList.add('active');
    this.selected = selected;
    select.points.push(this);
  }else if(!selected && this.selected){
    this.domElement.classList.remove('active');
    this.selected = selected;
    select.points.splice(select.points.indexOf(this), 1);
  }
  select.active = this;
}

Point.prototype.setPosition = function(norotate, forse){
  this.panorama.x = this.x;
  this.panorama.y = this.y;
  this.panorama.heading = this.rotate;
  var x = this.x * camera.scale + camera.x
  var y = this.y * camera.scale + camera.y
  var size = this.heightFromFloor*2*camera.scale;
  this.radius = size/2;

  var hidden = floors.active >= this.floor + 1 || floors.active <= this.floor - 1;
  var secondary = floors.active != this.floor;

  var draw = forse || (
    x>-this.radius &&
    y>-this.radius &&
    x<camera.width+this.radius &&
    y<camera.height+this.radius &&
    !hidden
  )

  if(draw || this.update){
    this.domElement.style.transform = 'translate('+x+'px, '+y+'px) rotate('+this.rotate+'deg)';
    if(!norotate)this.numberElement.style.transform = 'rotate('+(-this.rotate)+'deg)';
    this.domElement.style.setProperty('--point-size', size+'px');
    this.domElement.classList[hidden?'add':'remove']('hidden');
    this.domElement.classList[secondary?'add':'remove']('secondary');
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
      }else{
        if(!point.panorama.links) point.panorama.links = [];
        point.panorama.links.push({id: that.panorama.id})

        if(!that.panorama.links) that.panorama.links = [];
        that.panorama.links.push({id: point.panorama.id})
      }
    })
    links.draw()

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

  var that = this

  var shiftX = mouseX/camera.scale - that.x;
  var shiftY = mouseY/camera.scale - that.y
  select.points.forEach(function(point){
    point.move(shiftX, shiftY)
  })

  links.hide()
  map.setFov();

  Tour.pointsManager.set(Tour.view.id)
  Tour.needsUpdate = true;
}

Point.prototype.mouseUp = function(event){
  event.stopPropagation()
  if(this.start.x==this.x && this.start.x==this.x){
    Tour.view.set({id:this.panorama.id})
  }
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
}

Point.prototype.mouseMoveRotate = function(event){
  var a = event.pageX - (camera.x+this.x*camera.scale) - camera.offsetLeft;
  var b = event.pageY - (camera.y+this.y*camera.scale) - camera.offsetTop;
  this.panorama.heading = this.rotate = (THREE.Math.radToDeg(Math.atan2(b, a))+90) % 360;
  if(Tour.view.id == this.panorama.id){
    Tour.mesh.rotation.set(0, Math.PI / 2 - ((this.panorama.heading || 0) / 180 * Math.PI), 0);
    Tour.needsUpdate = true;
  }
  this.setPosition();
}

Point.prototype.mouseUpRotate = function(event){
  event.stopPropagation();
  this.domElement.classList.remove('rotate')
  document.removeEventListener('mousemove', this.onMouseMoveRotate);
  document.removeEventListener('mouseup', this.onMouseUpRotate);
  state.save()
}


function init(){
  map.init()
  links.init();
  state.get();
  floors.init()
  select.init();
  camera.update();

  properties.init()
  var activePoint = utils.findPoinnt(Tour.view.id);
  activePoint.select(true);
  camera.lookAt(activePoint);
}

var properties = {
  setPointsValue: function(key, value){
    select.points.forEach(function(point){
      point.panorama[key] = value
      console.log(point.panorama, key, value);
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
      })
    }else{
      this.inputs.forEach(function(input){
        input.value = '';
      })
    }
  },
  onChange: function(event){
    var input = event.target;
    var key = input.getAttribute('data-key');
    var type = input.getAttribute('data-type');
    var value = input.value;

    if(input.type == 'number')[
      value = parseFloat(value)
    ]

    this.setPointsValue(key, value);
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
    }else{
      //todo
    }
  },
  clearStorage: function(){
    if(confirm("clear storage?")){
      localStorage.clear();
      parent.location.reload();
    }
  },
  findPoinnt: function(id){
    return points.find(function(point){return point.panorama.id == id})
  },
  findAndMovePoint: function(){
    var point = this.findPoinnt(prompt('point id', 0))
    if(point){
      var view = camera.getView();
      point.x = view.x;
      point.y = view.y;
      point.floor = point.panorama.floor = floors.active;
      point.setPosition()
    }else{
      //todo
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
    var point = this.findPoinnt(prompt('point id', 0))
    if(point){
      camera.lookAt(point);
    }else{
      //todo
    }
  }
}


var floors = {
  active: null,
  init: function(){
    this.floorList = document.querySelector('.floor-list');
    this.plans = document.querySelector('.plans');
    this.setFloors();
    this.showFloor(0);
  },
  setFloors: function(){
    this.floorList.innerHTML = '';
    state.current.floors.forEach(function(floor, n){
      var li = document.createElement('li');
      li.classList.add('sub-menu-item');
      var span = document.createElement('span')
      span.classList.add('sub-menu-item-title');
      span.innerText = floor.title;
      li.appendChild(span);
      li.addEventListener('click', function(){
        floors.showFloor(n)
      })

      floors.floorList.appendChild(li);

      if (floor.plan) {
        var img = document.createElement('img');
        img.classList.add('plan');
        // img.classList.add('active');
        img.src = parent.location.origin+'/'+floor.plan.imageURL;
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
    }
    camera.draw(true);
    links.draw()
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
  draw: function(){
    console.log('draw')
    this.domElement.innerHTML = '';
    points.forEach(function(point){
      if(point.visible && point.panorama.links && point.panorama.links.length){
        point.panorama.links.forEach(function(link){
          var a = point;
          var b = utils.findPoinnt(link.id)
          if(a.panorama.id < b.panorama.id || !b.visible){
            var aPosition = a.getAbsolutePosition();
            var bPosition = b.getAbsolutePosition();
            var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", aPosition.x);
            line.setAttribute("y1", aPosition.y);
            line.setAttribute("x2", bPosition.x);
            line.setAttribute("y2", bPosition.y);
            if(a.panorama.floor != b.panorama.floor){
              line.setAttribute("stroke-dasharray", "5, 5");
            }
            links.domElement.appendChild(line);
          }
        })
      }
    })
    this.domElement.classList.remove('hidden');
  }
}


window.addEventListener('load', init);
