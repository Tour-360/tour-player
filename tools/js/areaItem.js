class AreaItem extends HTMLElement {
  #idElement;
  #titleElement;
  #svgPath;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['id', 'title', 'd'];
  }

  connectedCallback() {
    this.shadow = this.attachShadow({mode: "open"});

    this.shadow.innerHTML = `
    <style>
      .area-item {
        display: flex;
        align-items: center;
        padding: 12px;
        border: 1px solid transparent;
        box-sizing: border-box;
      }
      
      .area-item:hover {
        border: 1px solid var(--light-gray);
      }
      
      .area-item .preview {
        flex: 0 0 auto;
        cursor: pointer;
        height: 62px;
        width: 62px;
        background: var(--extra-light-gray);
        margin-right: 6px;
        overflow: hidden;
      }
      
      .area-item .preview svg {
        display: block;
        width: 100%;
        height: 100%;
      }
      
      .area-item .preview svg path {
        fill: var(--dark-gray);
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
    <li class="area-item">
      <div class="preview">
        <svg fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="${this.getAttribute('d')}"/>
        </svg>
      </div>
      <div class="properties">
        <x-field label="id" value="${this.getAttribute('id')}" ></x-field>
        <x-field label="title" value="${this.getAttribute('title')}" ></x-field>
      </div>
      <div class="controls">
        <button class="delete" type="Remove"></button>
      </div>
    </li>`

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
    this.#svgPath = this.shadow.querySelector('svg path');

    this.#idElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dispatchEvent(new Event('changeId'));
    });
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
      case "d": {
        console.log(name, newValue, this.#svgPath);
        if (this.#svgPath) {
          this.#svgPath.setAttribute('d', newValue);
        }
        break;
      }
    }
  }
}

customElements.define('area-item', AreaItem);
