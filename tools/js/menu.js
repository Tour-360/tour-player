class MenuItem {
  #parent;
  #key;
  #arrowDomElement;
  onClick;
  items;
  opened = false;
  domElement;
  titleDomElement;
  subTitleDomElement;
  subItemsDomElement;
  hotKeyDomElement;

  constructor(item) {
    if (item.options) this.options = item.options;
    this.domElement = document.createElement('li');
    this.domElement.classList.add('menu-item');
    this.domElement.addEventListener('click', this.#handleClick.bind(this));

    if (item.onClick) {
      this.onClick = item.onClick;
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


    this.#arrowDomElement = document.createElement('span');
    this.#arrowDomElement.classList.add('menu-item-arrow');
    this.#arrowDomElement.innerText = '▶';

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
    } else {
      this.#mainParent.close();
      this.onClick && this.onClick();
    }
  }

  toggle() {
    !this.opened ? this.open() : this.close();
  }

  open() {
    if (!this.#parent.#parent) {
      this.#parent.close();
      document.addEventListener('keydown', this.#handleEsc);
      document.addEventListener('click', this.#handleOutsideClick);
    } else if (Object.keys(this.#parent.items).length > 1) {
      Object.values(this.#parent.items).forEach(item => {
        console.log(item);
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
    document.removeEventListener('keydown', this.#handleOutsideClick);
  }

  addItem(name, item) {
    if (!this.items) {
      this.items = [];
    }
    this.items[name] = new MenuItem(item, this);
    this.subItemsDomElement.appendChild(this.items[name].domElement);
  }

  remove() {
    console.log(this.#key);
    console.log(this.#parent?.items[this.#key]);
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
      clearStorage: { title: "Clear storage", onClick: utils.clearStorage },
      open: { title: "Open", hotKey: '⌘O', onClick: () => alert() },
      saveAs: { title: "Save as...", hotKey: "⌘S", onClick: state.saveAsFile },
    },
  },
  edit: {
    title: "Edit",
    items: {
      undo: { title: "Undo", hotKey: '⌘Z', onClick: state.undo },
      redo: { title: "Redo", hotKey: '⌘⇧Z', onClick: state.redo },
      selectAllPoints: { title: "Select All Points", hotKey: '⌘⇧Z', onClick: () => select.all(true)}
    }
  },
  camera: {
    title: "Camera",
    items: {
      moveToOrigin: { title: "Move to origin", onClick: () => camera.lookAt({x:0,y:0}) },
      showActivePoint: { title: "Show active point", onClick: utils.showActivePoint },
      showFOVPoint: { title: "Show fov point", onClick: () => utils.showActivePoint() },
    }
  },
  select: {
    title: "Select",
    items: {
      select: { title: 'select', hotKey: '⌘A', onClick: () => select.all(true) }
    }
  },
  view: {
    title: "View",
    items: {
      points: {
        title: "Points",
        items: {
          default: { title: 'default', onClick: () => map.domElement.dataset.points = 'default' }
          // ...
        }
      }
    }
  },
  align: {
    title: "Align",
    items: {
      groupedPoints: { title: "Grouped points", hotKey: '⌘G' }
    }
  },
  floor: {
    title: "Floor",
    items: {
      selectFloor: {
        title: 'Select floor',
        items: {
          1: { title: "floor 1" },
          2: { title: "floor 2" },
          3: { title: "floor 3" },
        }
      },
      test: {
        title: 'Select floor',
        items: {
          1: { title: "floor 1" },
          2: { title: "floor 2" },
          3: { title: "floor 3" },
        }
      }
    }
  }
});
