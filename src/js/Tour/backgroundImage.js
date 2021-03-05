/* globals Tour, THREE */

Tour.backgroundImage = {};

Tour.backgroundImage.init = function () {
  this.wrapper = document.createElement("div");
  this.wrapper.className = "background-image__wrapper";
  Tour.domElement.appendChild(this.wrapper);
};

Tour.backgroundImage.set = function (url, color, callback) {
  if (color) {
    Tour.domElement.style.backgroundColor = color;
    Tour.renderer.setClearColor(new THREE.Color(color), 1);
    this.hasColor = true;
  }

  this.wrapper.innerHTML = "";

  if (url) {
    this.domElement = new Image();
    this.domElement.id = "background-image";
    this.domElement.decoding = "sync";

    if (this.domElement.decode) {
      this.domElement.src = url;
      this.domElement.decode().then(
        function () {
          this.wrapper.appendChild(this.domElement);
          window.requestAnimationFrame(function () {
            callback();
          });
        }.bind(this)
      );
    } else {
      this.domElement.onload = callback;
      this.domElement.src = url;
    }
  } else if (callback) {
    callback();
  }
};

Tour.backgroundImage.getUrl = function (callback) {
  var type = "image/jpeg";
  var quality = 0.5;

  if (!Tour.mesh.material[0].map.image) {
      callback(Tour.data.backgroundImage);
  } else if (Tour.renderer.domElement) {
    callback(Tour.renderer.domElement.toDataURL(type, quality));
  }
};

Tour.backgroundImage.transitionStart = function (callback, zoom) {
  this.zoom = zoom;
  var after = function () {
    Tour.data.backgroundImage = false;
    Tour.domElement.classList.add(
      zoom ? "transition-zoomin-start" : "transition-fadein-start"
    );
    Tour.domElement.classList.remove("transition-zoomin-end");
    Tour.domElement.classList.remove("transition-fadein-end");
    if (callback) {
      callback();
    }
  };

  if (Tour.options.rendererType !== "css" && Tour.options.transition) {
    this.getUrl(
      function (url) {
        this.set(url, Tour.data.backgroundColor, after);
      }.bind(this)
    );
  } else {
    setTimeout(after, 1);
  }
};

Tour.backgroundImage.transitionEnd = function () {
  Tour.domElement.classList.add(
    Tour.backgroundImage.zoom
      ? "transition-zoomin-end"
      : "transition-fadein-end"
  );
  Tour.domElement.classList.remove("transition-zoomin-start");
  Tour.domElement.classList.remove("transition-fadein-start");
};
