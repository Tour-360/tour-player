class AreaItem extends HTMLElement {
  #idElement;
  #titleElement;
  #previewElement;

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
        background-color: var(--extra-light-gray);
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        margin-right: 6px;
        overflow: hidden;
      }
      
      .area-item .properties {
        flex: 1;
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
      <div class="preview"></div>
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
