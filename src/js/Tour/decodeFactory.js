Tour.decodeFactory = {};
Tour.decodeFactory.init = function(){
  if(HTMLCanvasElement.prototype.transferControlToOffscreen){
    this.suported = true;
      this.sources = []

    var workerScript = ""+
  "  async function loadImage(event) {"+
  "    const ctx = new OffscreenCanvas(1, 1).getContext('2d');"+
  "    const url = event.data;"+
  "    const res = await fetch(url, {mode: 'cors'});"+
  "    const reader = res.body.getReader();"+
  "    const contentLength = +res.headers.get('Content-Length');"+
  "    let receivedLength = 0; "+
  "    let chunks = [];"+
  "    while(true) {const {done, value} = await reader.read(); if (done) {break;}; chunks.push(value); receivedLength += value.length; postMessage({type: 'onprogress', url: url, progress: receivedLength / contentLength})}" +
  "    const blob = new Blob(chunks);"+
  "    const bitmap = await createImageBitmap(blob, {"+
  "      premultiplyAlpha: 'none',"+
  "      colorSpaceConversion: 'none',"+
  "    });"+
  "    ctx.canvas.width = bitmap.width;"+
  "    ctx.canvas.height = bitmap.height;"+
  "    ctx.drawImage(bitmap, 0, 0);"+
  "    const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);"+
  "    const data = new Uint8Array(imgData.data);"+
  "    postMessage({"+
  "      url: url,"+
  "      type: 'onload',"+
  "      width: imgData.width,"+
  "      height: imgData.height,"+
  "      data: data.buffer,"+
  "    }, [data.buffer]);"+
  "  }"+
  "  onmessage = loadImage;"

    // var workerScript = "async function loadImage(event) {const ctx = new OffscreenCanvas(1, 1).getContext('2d');const url = event.data;const res = await fetch(url, {mode: 'cors'});const blob = await res.blob();const bitmap = await createImageBitmap(blob, {premultiplyAlpha: 'none',      colorSpaceConversion: 'none',    });    ctx.canvas.width = bitmap.width;    ctx.canvas.height = bitmap.height;    ctx.drawImage(bitmap, 0, 0);    const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);const data = new Uint8Array(imgData.data);postMessage({url: url,width: imgData.width,height: imgData.height,data: data.buffer,    }, [data.buffer]);    return false  }  onmessage = loadImage;";
    var blob = new Blob([workerScript], {type: 'application/javascript'});
    this.worker = new Worker(URL.createObjectURL(blob));
    this.worker.onmessage = function(event){
      var src = Tour.decodeFactory.sources[event.data.url]
      if(event.data.type == 'onprogress'){
        src.onprogress.map(function(f){
          if(f)f({
            url: event.data.url,
            progress: event.data.progress
          });
        })
      }else if(event.data.type == 'onload'){
        src.texture = new THREE.DataTexture(new Uint8Array(event.data.data), event.data.width, event.data.height, THREE.RGBAFormat);
        src.texture.flipY = true;
        src.onload.map(function(f){
          if(f)f(src.texture);
        })
      }
    }
  }
};


Tour.decodeFactory.load = function(url, onload, onprogress, onerror){
  var src = this.sources[url];
  if(!src){
    this.sources[url] = {}
    var src = this.sources[url];
    src.onload = [onload]
    src.onprogress = [onprogress]
    src.onerror = [onerror]
    this.worker.postMessage(url);
  }else{
    if(src.texture){
      onload(src.texture);
    }else{
      src.onload.push(onload);
      src.onprogress.push(onprogress);
      src.onerror.push(onerror);
    }
  }
}