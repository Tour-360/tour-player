class MenuItem {
  #parent;
  #key;
  #arrowDomElement;
  #value;
  action;
  items;
  opened = false;
  domElement;
  titleDomElement;
  subTitleDomElement;
  subItemsDomElement;
  hotKeyDomElement;

  constructor(item) {
    if (item.value) this.#value = item.value;

    if (item.options) {
      this.options = item.options;
      this.#value = item.value || Object.keys(this.options)[0];
    }
    if (item.type) this.type = item.type;

    this.domElement = document.createElement('li');
    this.domElement.classList.add('menu-item');
    this.domElement.addEventListener('click', this.#handleClick.bind(this));

    if (item.action) {
      this.action = item.action;
    }

    if (item.title) {
      this.titleDomElement = document.createElement('span');
      this.titleDomElement.classList.add('menu-item-title');
      this.title = item.title;
      this.domElement?.appendChild(this.titleDomElement);
    }

    this.items = item.items;
    this.subItemsDomElement = document.createElement('ul');
    this.subItemsDomElement.classList.add('menu');

    if (this.items) {
      Object.keys(this.items).forEach(key => {
        const i = item.items[key] = new MenuItem(this.items[key]);
        i.#parent = this;
        i.#key = key;
        this.subItemsDomElement.appendChild(i.domElement);
      });

      this.subTitleDomElement?.remove();
      this.hotKeyDomElement?.remove();
    }

    if (this.type === 'select' && this.options) {
      this.items = item.items = {};
      Object.keys(this.options).forEach(key => {
        const i = item.items[key] = new MenuItem({ title: this.options[key] });
        i.#parent = this;
        i.#key = i.#value = key;

        if (this.#value === key) {
          i.check(true);
        }
        this.subItemsDomElement.appendChild(i.domElement);
      });
    }


    this.#arrowDomElement = document.createElement('span');
    this.#arrowDomElement.classList.add('menu-item-arrow');
    this.#arrowDomElement.innerText = '▸';

    this.domElement?.appendChild(this.subItemsDomElement);
    this.domElement?.appendChild(this.#arrowDomElement);


    if (item.hotKey && !item.items) {
      this.hotKeyDomElement = document.createElement('span');
      this.hotKeyDomElement.classList.add('menu-item-hotkey');
      this.hotKey = item.hotKey;
      this.domElement?.appendChild(this.hotKeyDomElement);
    }

    if (item.subTitle && !item.items) {
      this.subTitle = item.subTitle;
      this.subTitleDomElement = document.createElement('span');
      this.subTitleDomElement?.classList.add('menu-item-subtitle');
      this.domElement?.appendChild(this.subTitleDomElement);
    }
  }

  check(value) {
    const newValue = value === undefined ? !this.value : value;
    this.domElement.classList[newValue ? 'add' : 'remove']('check');
  }

  #handleEsc = (e) => {
    if(e.key === "Escape") {
      e.preventDefault();
      this.#parent.close();
      document.removeEventListener('keydown', this.#handleEsc);
    }
  }

  #handleOutsideClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!this.#mainParent.domElement.contains(e.target)) {
      this.#mainParent.close();
      document.removeEventListener('click', this.#handleOutsideClick);
    }
  }

  #handleClick(e) {
    e.stopPropagation();
    e.preventDefault();

    if (
      this.items &&
      !this.subItemsDomElement?.contains(e.target)
    ) {
      this.toggle();
    } else if (this.type === 'checkbox') {
      this.#mainParent.close();
      this.#value = this.action(this.#value) || !this.#value;
      this.check(this.value);
    } else if (this.type === 'select') {
      this.toggle();
    } else if (this.#parent.type === 'select') {
      Object.keys(this.#parent.items).forEach((key) => {
        const item = this.#parent.items[key];
        if (this.#key === key) {
          const value = this.#parent.action(this.#value);
          const newValue = value === undefined ? key : value;
          item.check(newValue);
          this.#parent.#value = newValue;
        } else {
          item.check(false);
        }
      });
      this.check(true);
      this.#mainParent.close();
    } else {
      this.#mainParent.close();
      this.action && this.action();
    }
  }

  toggle() {
    !this.opened ? this.open() : this.close();
  }

  open() {
    if (!this.#parent?.#parent) {
      this.#parent.close();
      document.addEventListener('keydown', this.#handleEsc);
      document.addEventListener('pointerdown', this.#handleOutsideClick);
    } else if (Object.keys(this.#parent.items).length > 1) {
      // Закрывать соседей при переключении
      Object.values(this.#parent.items).forEach(item => {
        item.close();
      });
    }


    this.opened = true;
    this.domElement.classList.add('open');
  }

  close() {
    this.opened = false;
    this.domElement.classList.remove('open');
    this.items && Object.values(this.items).forEach(item => {
      item.close();
    });

    document.removeEventListener('keydown', this.#handleEsc);
    document.removeEventListener('pointerdown', this.#handleOutsideClick);
  }

  addItem(name, item) {
    if (!this.items) {
      this.items = [];
    }
    this.items[name] = new MenuItem(item);
    this.items[name].#parent = this;
    this.subItemsDomElement.appendChild(this.items[name].domElement);
    return this;
  }

  remove() {
    this.domElement?.remove();
    delete this.#parent?.items[this.#key];
  }

  set title(title) {
    this.titleDomElement.innerText = title;
  }

  get title() {
    return this.titleDomElement.innerText;
  }

  set hotKey(title) {
    this.hotKeyDomElement.innerText = title;
  }

  get hotKey() {
    return this.hotKeyDomElement.innerText;
  }

  set subTitle(title) {
    this.subTitleDomElement.innerText = title;
  }

  get subTitle() {
    return this.subTitleDomElement.innerText;
  }

  set value(value) {
    if (this.type === 'select') {
      Object.keys(this.items).forEach((key) => {
        if (value === key) {
          this.items[key].check(true);
        } else {
          this.items[key].check(false);
        }
      });

      this.#value = value;
    } else if (this.type === 'checkbox') {
      this.#value = value;
      this.check(this.#value);
    } else {
      this.#value = value;
    }
  }

  get value() {
    return this.#value;
  }

  get #mainParent() {
    return this.#parent?.#parent ? this.#parent.#mainParent : this;
  }
}

class Menu {
  constructor(selector, items) {
    this.domElement = document.querySelector(selector);

    const menu = new MenuItem({ items });
    this.items = menu.items;
    this.domElement.appendChild(menu.subItemsDomElement);
  }
}

const menu = new Menu('.header',{
  file: {
    title: "File",
    items: {
      copyCode: { title: "Copy code" },
      clearStorage: { title: "Clear storage", action: utils.clearStorage },
      open: { title: "Open", hotKey: '⌘O', action: () => alert() },
      saveAs: { title: "Save as...", hotKey: "⌘S", action: () => state.saveAsFile() },
      saveToServer: { title: "Save to server", hotKey: "⌘ Alt S", action: () => state.saveToServer() },
    },
  },
  edit: {
    title: "Edit",
    items: {
      undo: { title: "Undo", hotKey: '⌘Z', action: state.undo },
      redo: { title: "Redo", hotKey: '⌘⇧Z', action: state.redo },
      selectAllPoints: { title: "Select All Points", hotKey: '⌘A', action: () => select.all(true)}
    }
  },
  camera: {
    title: "Camera",
    items: {
      scaleIn: { title: "Scale in", hotKey: '⌘+', action: () => camera.setScale(camera.scale * 1.2) },
      ScaleOut: { title: "Scale out", hotKey: '⌘-', action: () => camera.setScale(camera.scale / 1.2) },
      defaultScale: { title: "Default scale", hotKey: '⌘0', action: () => camera.setScale(camera.defaultScale) },
      moveToOrigin: { title: "Move to origin", action: () => camera.lookAt({x:0,y:0}) },
      showActivePoint: { title: "Show active point", action: () => utils.showActivePoint() },
      showFOVPoint: { title: "Show fov point", action: () => utils.showActivePoint() },
      tourCameraFollowMap: {
        title: "Tour camera follow map",
        type: "checkbox",
        action: () => {
          camera.trackingMap = !camera.trackingMap
          return camera.trackingMap;
        }
      },
      mapCameraFollowTour: {
        title: "Map camera follow tour",
        type: "checkbox",
        action: () => {
          camera.trackingTour = !camera.trackingTour
          return camera.trackingTour;
        }
      },
    }
  },
  select: {
    title: "Select",
    items: {
      select: { title: 'select', hotKey: '⌘A', action: () => select.all(true) }
    }
  },
  view: {
    title: "View",
    items: {
      points: {
        title: "Points",
        type: 'select',
        options: {
          default: "Default",
          lite: "Lite",
          full: "Full",
          transparent: "Transparent",
        },
        action: (value) => map.domElement.dataset.points = value
      },
      minimize: {
        title: "Minimize",
        action: () => window.resizeTo(320, 740)
      },
      devCursor: {
        title: "Dev cursor",
        type: "checkbox",
        action: () => {
          return UI.devCursor.toggle();
        }
      }
    }
  },
  align: {
    title: "Align",
    items: {
      groupedPoints: { title: "Grouped points", hotKey: '⌘G', action: () => utils.alignSelectedPoints() }
    }
  },
  points: {
    title: "Points",
    items: {
      findAndShowPoint: {
        title: 'Find and show point…',
        hotKey: '⌘F',
        action: () => utils.findAndShowPoint()
      },
      findAndMovePoint: {
        title: 'Find and move point…',
        hotKey: '⌘⇧F',
        action: () => utils.findAndMovePoint()
      },
      findAndMovePoint2: {
        title: 'Set floor at selected points…',
        // hotKey: '⌘⇧F',
        action: () => utils.findAndMovePoint()
      },
      linkSelectedPoints: {
        title: 'Link selected points',
        action: () => utils.linkSelectedPoints()
      },
      removeAllLinks: {
        title: 'Remove all links on selected point',
        hotKey: '⌘⇧L',
        action: () => utils.removeAllLinks()
      },
    }
  },
  merkers: {
    title: "Markers",
    items: {
      addNewMarker: {
        title: 'Add new marker',
        hotKey: '⌘⇧F',
        action: () => markers.add()
      },
      deleteAllMarkers: {
        title: 'Delete all markers',
        action: () => markers.removeAll()
      },
      createMarkersByLinksDirection: {
        title: 'Create markers by links direction',
        action: () => markers.createMarkersByLinksDirection()
      },
      createMarkersByLinksDirectionAtSelectedPoint: {
        title: 'Create markers by links direction at selected point',
        action: () => markers.createMarkersByLinksDirectionAtSelectedPoint()
      },
      deleteAllMarkersAtSelectedPoint: {
        title: 'Delete all markers at selected point',
        action: () => markers.deleteAllMarkersAtSelectedPoint()
      }
    }
  },
  actions: {
    title: 'Actions',
    items: {
      generateNadirMap: {
        title: 'Generate nadir map',
        action: () => utils.generateNadirMap()
      }
    }
  },
  panorama: {
    title: 'Panorama',
    items: {
      setDefaultView: {
        title: 'Set default view',
        action: () => utils.setDefaultView()
      },
      setDefaultViewLonOnly: {
        title: 'Set default view: lon only',
        action: () => utils.setDefaultView(true)
      },
      setStartPanorama: {
        title: 'Set start panorama',
        action: () => utils.setStartPanorama(true)
      },
      deleteSelectedPanoramas: {
        title: 'Delete selected panoramas',
        hotKey: '⌫',
        action: () => utils.deleteSelectedPanoramas()
      },
      addPanorama: {
        title: 'Add panorama',
        action: () => utils.addPanorama()
      },
      addPanorams: {
        title: 'Add panorams',
        action: () => utils.addPanorams()
      },
    }
  },
  floor: {
    title: "Floor",
    items: {
      hideAll: {
        title: 'Hide all floors',
        action: () => floors.showFloor()
      }
    }
  }
});
