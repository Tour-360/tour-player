'use strict';

class Floors {
  #active = 0;

  constructor() {
    this.update = this.update.bind(this);
    this.createUniqId = this.createUniqId.bind(this);
    this.createFloor = this.createFloor.bind(this);
    this.getFloorIndexByTarget = this.getFloorIndexByTarget.bind(this);
    this.getFloorByTarget = this.getFloorByTarget.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.handleChange = this.handleChange.bind(this);

    this.listElement = document.querySelector('.sidebar-content[data-id="floors"] x-list');
    this.addButtonElement = document.querySelector('.add-new-floor');
    this.dropAreaElement = document.querySelector('.sidebar-content[data-id="floors"] drop-area');

    this.dropAreaElement.addEventListener('drop', (e) => {
      uploadFile(e.target.files, 'floors', (file) => {
        const newFloor = {
          height: 500,
          title: this.createUniqId(),
          plan: {
            src: file.src,
            x: 0,
            y: 0,
            width: 5000,
            opacity: 1
          }
        }
        state.current.floors.push(newFloor);
        this.createFloor(newFloor);
        this.update();
      }).then(() => {

      });
    });

    this.addButtonElement.addEventListener('click', () => {
      const newFloor = {
        height: 500,
        title: this.createUniqId(),
        plan: {
          src: '',
          x: 0,
          y: 0,
          width: 5000,
          opacity: 1
        }
      }
      state.current.floors.push(newFloor);
      this.createFloor(newFloor);
      this.update();
    })
  }

  init() {
    this.floorList = document.querySelector('.floor-list');
    this.plans = document.querySelector('.plans');

    if (!state?.current.floors) {
      state.current.floors = [];
    }

    state?.current.floors.forEach(this.createFloor);

    this.listElement.addEventListener('changeOrder', e => {
      const { from, to } = e.detail;
      arrayMove(state.current.floors, from, to);
      this.update();
    })

    this.update();
  }

  update() {
    this.plans.innerHTML = '';

    if (menu.items.floor.items.selectFloor) {
      menu.items.floor.items.selectFloor.remove();
    }

    menu.items.floor.addItem('selectFloor', {
      title: 'Select Floor',
      type: 'select',
      value: this.active.toString(),
      options: Object.fromEntries(
        state.current.floors
          .map((floor, id) => ([ id, `${id} - ${floor.title}` ]))
      ),
      action: (id) => {
        toasts.push(`Selected ${state.current.floors[id].title}`);
        return this.active = parseFloat(id);
      }
    });

    state.current.floors.forEach(floor => {
      const { plan } = floor;
      if (plan) {
        const img = document.createElement('img');
        img.classList.add('plan');
        // img.classList.add('active');
        img.src = path.resolve(plan.src);
        img.style.transform = `translate(${plan.x}px, ${plan.y}px)`;

        if (plan.width) img.width = plan.width;
        if (plan.height) img.height = plan.height;
        if (plan.opacity) img.style.opacity = plan.opacity;

        this.plans.appendChild(img);
      }
    })

    this.active = this.active;

    state.save();
    const event = new Event('update');
    this.listElement.dispatchEvent(event);
  }

  createUniqId() {
    return state.current.floors.length;
  }

  handleChange(e) {
    const floor = this.getFloorByTarget(e.target);

    floor.title = e.target.title;
    floor.height = e.target.height;
    floor.plan.width = e.target.width;
    floor.plan.src = e.target.src;
    floor.plan.x = e.target.x;
    floor.plan.y = e.target.y;
    floor.plan.opacity = e.target.opacity;

    this.update();
  }

  handleDelete(e) {
    const floor = this.getFloorByTarget(e.target);
    if (confirm(`Are you sure you want to delete this floor "${floor.title}"`)) {
      this.listElement.removeChild(e.target);
      state.current.floors = state.current.floors.filter(f => f !== floor);
      this.update();
    }
  }

  getFloorIndexByTarget(target) {
    return Array.prototype.indexOf.call(target.parentElement.parentElement.children, target.parentElement);
  }

  getFloorByTarget(target) {
    return state.current.floors[this.getFloorIndexByTarget(target)];
  }

  createFloor(floor) {
    const floorItem = document.createElement('floor-item');
    floorItem.title = floor.title;
    floorItem.height = floor.height;
    floorItem.x = floor.plan?.x || '0';
    floorItem.y = floor.plan?.y || '0';
    floorItem.src = floor.plan?.src || '';
    floorItem.width = floor.plan?.width || '';
    floorItem.opacity = floor.plan?.opacity || '1';

    floorItem.addEventListener('change', this.handleChange);
    floorItem.addEventListener('dblclick', () => {
      this.active = this.getFloorIndexByTarget(floorItem);
    });
    floorItem.addEventListener('delete', this.handleDelete);

    this.listElement.appendChild(floorItem);

    this.update();
  }

  set active(value) {
    if (value === undefined || !this.plans) return;
    this.#active = value;

    Array.from(this.plans.children).forEach((plan, i) => {
      plan.classList[value === i ? 'add' : 'remove']('active')
    })

    camera.draw();
    camera.draw();
    links.draw();
  }

  get active() {
    return this.#active;
  }

  setPosition() {
    if (this.plans) {
      this.plans.style.transform = 'translate('+camera.x+'px, '+camera.y+'px) scale('+camera.scale+')';
    }
  }
}

window.floors = new Floors();
