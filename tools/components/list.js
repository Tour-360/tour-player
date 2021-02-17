function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};

class List extends HTMLElement {
  #listElement;
  #active;
  #moveTo;
  #items = [];

  throttle(func, ms) {

    let isThrottled = false,
      savedArgs,
      savedThis;

    function wrapper() {

      if (isThrottled) { // (2)
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      func.apply(this, arguments); // (1)

      isThrottled = true;

      setTimeout(function() {
        isThrottled = false; // (3)
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }

    return wrapper;
  }

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });

    this.shadow.innerHTML = `
      <style>
        :host {
          min-height: 0;
          /*margin: var(--margin, 12px);*/
        }
        
        .list {
          height: 100%;
          overflow-y: auto;
          display: block;
          padding: 0;
          margin: 0;
        }
        
        .list:empty::before {
          width: calc(100% - 128px);
          line-height: 1.4em;
          text-align: center;
          color: var(--dark-gray);
          margin: 64px auto;
          content: attr(data-empty-text);
          display: block;
        }
        
        .item-list > *:last-child {
          --border-size: 0;
        }
        
        .item {
          position: relative;
        }
        
        .item::before {
          content: '';
          display: block;
          width: 5px;
          height: 8px;
          position: absolute;
          top: 0;
          left: 4px;
          bottom: 0;
          margin: auto;
          background-image: url('assets/dnd.svg');
          cursor: grab;
          z-index: 1;
          background-size: 100% 100%;
          opacity: 0;
        }
        
        .list.hover .item:not(.skeleton).line::after {
          content: '';
          display: block;
          position: absolute;
          right: 0;
          left: 0;
          bottom: 0;
          background: var(--accent);
          height: 2px;
        }
        
        .item:hover::before {
          opacity: .5;
        }
        
        .item.selected::before {
          opacity: 1;
        }
        
        .item:not(.skeleton):not(:last-child) {
          border-bottom: 1px solid var(--extra-light-gray);
          margin-bottom: -1px;
        }
        
        /*.item:not(.selected):not(.skeleton):not(:last-child)::after {*/
        /*  display: block;*/
        /*  content: '';*/
        /*  position: absolute;*/
        /*  height: 1px;*/
        /*  width: calc(100% - 32px);*/
        /*  background: var(--extra-light-gray);*/
        /*  margin: auto;*/
        /*  bottom: 0;*/
        /*  left: 0;*/
        /*  right: 0;*/
        /*}*/
        
        .item.skeleton::after {
          position: absolute;
          display: block;
          content: '';
          background: var(--extra-light-gray);
          border: 1px solid var(--light-gray);
          border-width: 1px 0;
          box-sizing: border-box;
          height: 100%;
          width: 100%;
          z-index: 1;
          top: 0;
          left: 0;
        }
      </style>
      <div data-empty-text="${this.getAttribute('empty-text') || "Empty list"}" class="list"></div>
    `;

    this.#listElement = this.shadow.querySelector('.list');

    this.#listElement.addEventListener(`dragstart`, (e) => {
      if (e.dataTransfer.types[0] === "Files") return;
      e.target.classList.add(`selected`);
      this.#active = this.#items.findIndex(i => i === e.target);
    });

    this.#listElement.addEventListener(`dragend`, (e) => {
      if (e.dataTransfer.types[0] === "Files") return;
      e.target.classList.remove(`selected`);
      this.#listElement.classList.remove(`hover`);
      this.#items[this.#active].classList.remove('skeleton');
      if(this.isHovered(e)) {
        this.setLine(null);
        if (this.#moveTo !== null && this.#active !== this.#moveTo) {
          this.#listElement.insertBefore(
            this.#items[this.#active],
            this.#items[this.#moveTo+1]
          );

          const newIndex = this.#moveTo + (this.#active > this.#moveTo ? 1 : 0);

          array_move(
            this.#items,
            this.#active,
            newIndex,
          );
          this.dispatchEvent(new CustomEvent('changeOrder', { detail: {
            from: this.#active, to: newIndex
          }}));
        }
      }
    });

    this.#listElement.addEventListener(`dragover`, this.handleDragover.bind(this));
    this.#listElement.addEventListener(`drag`, (e) => {
      if (e.dataTransfer.types[0] === "Files") return;
      // this.#items[this.#active].classList.add('skeleton');
      this.#listElement.classList[this.isHovered(e) ? 'add' : 'remove']('hover');
    });
  }

  isHovered(e) {
    const listRect = this.#listElement.getBoundingClientRect();
    const listEnd = {
      x: listRect.x + listRect.width,
      y: listRect.y + listRect.height
    };

    return e.x >= listRect.x && e.x < listEnd.x &&
      e.y >= listRect.y && e.y <= listEnd.y;
  }

  handleDragover(e) {
    e.preventDefault();
    if (e.dataTransfer.types[0] === "Files") return;
    this.#items[this.#active].classList.add('skeleton');
    if(e.target !== this.#items[this.#active].children[0]) {
      for (let i=0; i < this.#items.length; i++) {
        const item = this.#items[i];
        if (item.children[0] === e.target) {
          const rect = item.getBoundingClientRect();
          this.#moveTo = (e.y > rect.y + rect.height / 2) ? i : Math.max(i-1, 0);
          this.setLineThrottled(this.#moveTo);
          return;
        }
      }
    }
  }

  setLine(id) {
    this.#items.forEach((item, i) => {
      this.#items[i].classList[id === i ? 'add' : 'remove']('line');
    });
  }

  setLineThrottled = this.throttle(this.setLine, 100);

  static get observedAttributes() {
    return [''];
  }

  connectedCallback() {
    while (this.children.length) {
      this.appendChild(this.children[0]);
    }
  }

  appendChild(newChild) {
    const item = document.createElement('div');
    item.classList.add('item');
    item.appendChild(newChild);
    item.draggable = true;
    this.#listElement.appendChild(item);
    this.#items.push(item);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // this.#valueElement && this.update();
  }

  set innerHTML(html) {
    this.#listElement.innerHTML = html;
    this.#items = [];
  }

  get innerHTML() {
    return this.#listElement.innerHTML;
  }

  removeChild(oldChild) {
    this.#listElement.removeChild(this.#items[
      this.#items.findIndex(i => i.children[0] === oldChild)
    ]);
  }
}

customElements.define('x-list', List);
