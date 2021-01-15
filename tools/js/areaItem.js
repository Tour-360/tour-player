class AreaItem extends HTMLElement {
  #idElement;
  #titleElement;
  #previewElement;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['id', 'title', 'image'];
  }

  connectedCallback() {
    this.shadow = this.attachShadow({mode: "open"});

    this.shadow.innerHTML = `
    <style>
      .area-item {
        position: relative;
        display: flex;
        align-items: center;
        padding: 12px;
        box-sizing: border-box;
      }
      
      .area-item::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        display: block;
        height: var(--border-size, 1px);
        width: calc(100% - 32px);
        background: var(--extra-light-gray);
      }
      
      .area-item:hover {
        /*border: 1px solid var(--light-gray);*/
        /*background: var(--extra-light-gray);*/
      }
      
      .area-item .preview {
        flex: 0 0 auto;
        cursor: pointer;
        height: 62px;
        width: 62px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        margin-right: 6px;
        overflow: hidden;
      }
      
      .area-item:hover .preview {
        filter: drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black) drop-shadow(0 1px 0 black) drop-shadow(0 -1px 0 black);
      }
      
      .area-item .properties {
        flex: 1;
        min-width: 0;
      }
      
      .area-item .controls {
        margin-left: 6px;
        opacity: 0;
      }
      
      .area-item:hover .controls {
        opacity: 1;
      }
      
      x-field {
        --margin: 2px 0;
      }
      
      button {
        font-family: inherit;
        padding: 6px;
        border: none;
        background-color: transparent;
        background-position: center;
        background-size: 16px 16px;
        background-repeat: no-repeat;
        border-radius: 4px;
        min-width: 24px;
        min-height: 24px;
        cursor: pointer;
        outline: none;
      }
      
      button.primary {
        border: 1px solid;
      }
      
      button:not(.primary):hover {
        background-color: var(--extra-light-gray);
      }
      button.primary:active {
        background-color: var(--extra-light-gray);
      }
      
      button.delete {
        background-image: url('assets/delete.svg');
      }
    </style>
    <div class="area-item">
      <div class="preview"></div>
      <div class="properties">
        <x-field label="id" value="${this.getAttribute('id')}" ></x-field>
        <x-field label="title" value="${this.getAttribute('title')}" ></x-field>
      </div>
      <div class="controls">
        <button class="delete" type="Remove"></button>
      </div>
    </div>`

    this.shadow.querySelector('.preview').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dispatchEvent(new Event('click'));
    });

    this.shadow.querySelector('.delete').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dispatchEvent(new Event('delete'));
    });

    this.#idElement = this.shadow.querySelector('x-field[label="id"]');
    this.#titleElement = this.shadow.querySelector('x-field[label="title"]');
    this.#previewElement = this.shadow.querySelector('.preview');

    this.#previewElement.style.backgroundImage = `url("${this.getAttribute('image')}")`;

    this.#idElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setAttribute('id', e.target.value);
      this.dispatchEvent(new Event('changeId'));
    });

    this.#titleElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setAttribute('title', e.target.value);
      this.dispatchEvent(new Event('changeTitle'));
    });

    this.shadow.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    })
  }

  set id(value) {
    this.setAttribute('id', value);
  }

  get id() {
    return this.getAttribute('id');
  }

  set title(value) {
    this.setAttribute('title', value);
  }

  get title() {
    return this.getAttribute('title');
  }

  set image(value) {
    this.setAttribute('image', value);
  }

  get image() {
    return this.getAttribute('image');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name){
      case "id": {
        if (this.#idElement) {
          this.#idElement.value = newValue;
        }
        break;
      }
      case "title": {
        if (this.#titleElement) {
          this.#titleElement.value = newValue;
        }
        break;
      }
      case "image": {
        if (this.#previewElement) {
          this.#previewElement.style.backgroundImage = `url("${newValue}")`;
        }
        break;
      }
    }
  }
}

customElements.define('area-item', AreaItem);
