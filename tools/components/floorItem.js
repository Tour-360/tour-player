class FloorItem extends HTMLElement {
  #container;
  #titleField;
  #heightField;
  #xField;
  #yField;
  #widthField;
  #opacityField;
  #srcField;
  #previewElement;

  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"});

    this.shadow.innerHTML = `
    <style>
    
      .container {
        position: relative;
        display: flex;
        align-items: center;
        padding: 12px;
        box-sizing: border-box;
      }
      
      .container .preview {
        /*--color: var(--light-gray);*/
        width: 64px;
        height: 64px;;
        flex: 0 0 auto;
        
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        margin-right: 6px;
        align-self: flex-start;
      }

      .container .properties {
        flex: 1;
        min-width: 0;
      }
      
      .container .row {
        display: flex;
        margin: 2px 0;
      }
      
      .container .row > * {
        flex: 1;
        min-width: 0;
        --margin: 0 2px;
      }
      
      .container .controls {
        margin-left: 6px;
        opacity: 0;
      }
      
      .container:hover .controls {
        opacity: 1;
      }
      
      x-field {
        --margin: 2px 0;
      }
      
      check-box {
        margin: 2px 8px;
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
        background-image: url('./assets/delete.svg');
      }
      
    </style>
    <div class="container" data-type="${this.getAttribute('type')}">
      <div class="preview"></div>
      <div class="properties">
        <div class="row">
          <x-field label="title" value="${this.getAttribute('title')}" ></x-field>
          <x-field label="height" type="number" value="${this.getAttribute('height')}" ></x-field>
        </div>
        <div class="row">
          <x-field label="src" value="${this.getAttribute('src')}" ></x-field>
        </div>
        <div class="row">
          <x-field label="x" type="number" value="${this.getAttribute('x')}" ></x-field>
          <x-field label="y" type="number" value="${this.getAttribute('y')}" ></x-field>
        </div>
        <div class="row">
          <x-field label="width" type="number" value="${this.getAttribute('width')}" ></x-field>
          <x-field label="opacity" step="0.1" type="number" value="${this.getAttribute('opacity')}" ></x-field>
        </div>
      </div>
      <div class="controls">
        <button class="delete" type="Remove"></button>
      </div>
    </div>`

    this.shadow.querySelector('.delete').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dispatchEvent(new Event('delete'));
    });

    this.#container = this.shadow.querySelector('.container');
    this.#titleField = this.shadow.querySelector('x-field[label="title"]');
    this.#heightField = this.shadow.querySelector('x-field[label="height"]');
    this.#srcField = this.shadow.querySelector('x-field[label="src"]');
    this.#xField = this.shadow.querySelector('x-field[label="x"]');
    this.#yField = this.shadow.querySelector('x-field[label="y"]');
    this.#widthField = this.shadow.querySelector('x-field[label="width"]');
    this.#opacityField = this.shadow.querySelector('x-field[label="opacity"]');
    this.#previewElement = this.shadow.querySelector('.preview');

    this.#previewElement.style.backgroundImage = `url(${path.resolve(this.getAttribute('src'))})`;


    this.#titleField.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.title = e.target.value;
      this.dispatchEvent(new Event('changeTitle'));
    });

    this.#heightField.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.height = e.target.value;
      this.dispatchEvent(new Event('changeHeight'));
    });

    this.#xField.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.x = e.target.value;
      this.dispatchEvent(new Event('changeX'));
    });

    this.#yField.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.y = e.target.value;
      this.dispatchEvent(new Event('changeY'));
    });

    this.#widthField.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.width = e.target.value;
      this.dispatchEvent(new Event('changeWidth'));
    });

    this.#opacityField.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.opacity = e.target.value;
      this.dispatchEvent(new Event('changeOpacity'));
    });

    this.#srcField.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.src = e.target.value;
      this.dispatchEvent(new Event('changeSrc'));
    });
  }

  static get observedAttributes() {
    return ['title', 'height', 'src', 'x', 'y', 'width', 'opacity'];
  }

  connectedCallback() {

  }

  set title(value) {
    this.setAttribute('title', value);
  }

  get title() {
    return this.getAttribute('title');
  }

  set height(value) {
    this.setAttribute('height', value);
  }

  get height() {
    return this.getAttribute('height');
  }

  set src(value) {
    this.setAttribute('src', value);
  }

  get src() {
    return this.getAttribute('src');
  }

  set x(value) {
    this.setAttribute('x', value);
  }

  get x() {
    return this.getAttribute('x');
  }

  set y(value) {
    this.setAttribute('y', value);
  }

  get y() {
    return this.getAttribute('y');
  }

  set width(value) {
    this.setAttribute('width', value);
  }

  get width() {
    return this.getAttribute('width');
  }

  set opacity(value) {
    this.setAttribute('opacity', value);
  }

  get opacity() {
    return this.getAttribute('opacity');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.dispatchEvent(new Event('change'));
    switch (name) {
      case "title": {
        if (this.#titleField) {
          this.#titleField.value = newValue;
        }
        break;
      }
      case "height": {
        if (this.#heightField) {
          this.#heightField.value = newValue;
        }
        break;
      }
      case "x": {
        if (this.#xField) {
          this.#xField.value = newValue;
        }
        break;
      }
      case "y": {
        if (this.#yField) {
          this.#yField.value = newValue;
        }
        break;
      }
      case "src": {
        if (this.#srcField) {
          this.#srcField.value = newValue;
          this.#previewElement.style.backgroundImage = `url(${path.resolve(newValue)})`;
        }
        break;
      }
      case "width": {
        if (this.#widthField) {
          this.#widthField.value = newValue;
        }
        break;
      }
      case "opacity": {
        if (this.#opacityField) {
          this.#opacityField.value = newValue;
        }
        break;
      }
    }
  }
}

customElements.define('floor-item', FloorItem);
