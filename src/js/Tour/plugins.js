/* globals DB, Tour, playerFolder */

Tour.plugins = {};

var pluginList = {
  db: {
    script: 'db.js',
    callback: function (data) {
      DB.init(data);
    }
  },
  modal: {
    script: 'modal.js',
    style: 'modal.css',
  }
}

Tour.plugins.init = function(plugins) {
  function initPlugin(pluginName) {
    var plugin = pluginList[pluginName] || {
      script: pluginName + '.js'
    };
    if (plugin.script) {
      var script = document.createElement('script');
      script.src = [Tour.options.pluginsFolder, pluginName, plugin.script].join('/');
      document.head.appendChild(script);
      if (plugin.callback) {
        var count = 0;
        function callback() {
          count++;
          if (count >= 2) {
            console.log('Run plugin: ' + pluginName);
            plugin.callback(Tour.data);
          }
        }
        script.addEventListener('load', callback);
        Tour.on('load', callback);
      } else {
        script.addEventListener('load', function() {
          console.log('Connected plugin: ' + pluginName);
        });
      }
    }
    if (plugin.style) {
      var link = document.createElement('link');
      link.rel = "stylesheet";
      link.href = [Tour.options.pluginsFolder, pluginName, plugin.style].join('/');
      document.head.appendChild(link);
    }
  }

  if (typeof plugins === 'string') {
    initPlugin(plugins);
  } else if (typeof plugins === 'object') {
    plugins.forEach(initPlugin);
  } else {
    Tour.options.plugins.forEach(initPlugin);
  }
}
