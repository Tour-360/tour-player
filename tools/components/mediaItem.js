class MediaItem extends HTMLElement {
  #container;
  #idElement;
  #typeElement;
  #srcElement;
  #previewElement;
  #loopElement;
  #autoplayElement;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['id', 'type', 'src', 'loop', 'autoplay'];
  }

  connectedCallback() {
    this.shadow = this.attachShadow({mode: "open"});

    this.shadow.innerHTML = `
    <style>
    
      .media-item {
        position: relative;
        display: flex;
        align-items: center;
        padding: 12px;
        box-sizing: border-box;
      }
      
      .media-item .preview-wrapper {
        --color: var(--light-gray);
        width: 64px;
        height: 64px;;
        flex: 0 0 auto;
        background-image:
          linear-gradient(45deg, var(--color) 25%, transparent 25%),
          linear-gradient(-45deg, var(--color) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, var(--color) 75%),
          linear-gradient(-45deg, transparent 75%, var(--color) 75%);
        background-size: 16px 16px;
        background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
        margin-right: 6px;
        align-self: flex-start;
      }
      
      .media-item .preview {
        width: 100%;
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: auto;
      }
      
      .media-item .properties {
        flex: 1;
        min-width: 0;
      }
      
      .media-item .row {
        display: flex;
        margin: 2px 0;
      }
      
      .media-item .row > * {
        flex: 1;
        min-width: 0;
        --margin: 0 2px;
      }
      
      .media-item .controls {
        margin-left: 6px;
        opacity: 0;
      }
      
      .media-item:hover .controls {
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
      
      .only-video,
      .only-image {
        display: none !important;
      }
      .media-item[data-type="video"] .only-video {
        display: flex !important;
      }
      
      
    </style>
    <div class="media-item" data-type="${this.getAttribute('type')}">
      <div class="preview-wrapper"><div class="preview"></div></div>
      <div class="properties">
        <div class="row">
          <x-field label="id" value="${this.getAttribute('id')}" ></x-field>
          <select-wrapper class="select-type" label="type">
            <select name="type">
              <option value="image">image</option>
              <option value="video">video</option>
            </select>
          </select-wrapper>
        </div>
        <div class="row">
          <x-field class="field-src" label="src" value="${this.getAttribute('src')}" ></x-field>
        </div>
        <div class="row only-video">
          <check-box class="loop">loop</check-box>
          <check-box class="autoplay">autoplay</check-box>
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

    this.#container = this.shadow.querySelector('.media-item');
    this.#idElement = this.shadow.querySelector('x-field[label="id"]');
    this.#srcElement = this.shadow.querySelector('x-field[label="src"]');
    this.#typeElement = this.shadow.querySelector('select[name="type"]');
    this.#previewElement = this.shadow.querySelector('.preview');
    this.#loopElement = this.shadow.querySelector('.loop');
    this.#autoplayElement = this.shadow.querySelector('.autoplay');

    this.#previewElement.style.backgroundImage = `url(${this.getAttribute('src')})`;

    this.#idElement.id = this.getAttribute('id');
    this.#srcElement.src = this.getAttribute('src');
    this.#typeElement.value = this.getAttribute('type');

    this.#idElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.id = e.target.value;
      this.dispatchEvent(new Event('changeId'));
    });


    this.#srcElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.src = e.target.value;
      this.#previewElement.style.backgroundImage = `url(${e.target.value})`;
      this.dispatchEvent(new Event('changeSrc'));
    });

    this.#typeElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.type = e.target.value;
      this.#container.dataset.type = this.type;
      this.dispatchEvent(new Event('changeType'));
    });

    this.#loopElement.addEventListener('change', (e) => {
      this.loop = e.target.checked;
      this.dispatchEvent(new Event('changeLoop'));
    });

    this.#autoplayElement.addEventListener('change', (e) => {
      this.autoplay = e.target.checked;
      this.dispatchEvent(new Event('changeAutoplay'));
    });
  }

  set id(value) {
    this.setAttribute('id', value);
  }

  get id() {
    return this.getAttribute('id');
  }

  set src(value) {
    this.setAttribute('src', value);
  }

  get src() {
    return this.getAttribute('src');
  }

  set type(value) {
    this.setAttribute('type', value);
  }

  get type() {
    return this.getAttribute('type');
  }

  set loop(value) {
    this.setAttribute('loop', value);
  }

  get loop() {
    return this.getAttribute('loop');
  }

  set autoplay(value) {
    this.setAttribute('loop', value);
  }

  get autoplay() {
    return this.getAttribute('loop');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name){
      case "id": {
        if (this.#idElement) {
          this.#idElement.value = newValue;
        }
        break;
      }
      case "src": {
        if (this.#srcElement) {
          this.#srcElement.value = newValue;
        }
        break;
      }
      case "loop": {
        if (this.#loopElement) {
          this.#loopElement.value = newValue;
        }
        break;
      }
      case "autoplay": {
        if (this.#loopElement) {
          this.#autoplayElement.checked = newValue;
        }
        break;
      }
      case "type": {
        if (this.#typeElement) {
          this.#typeElement.value = newValue;
          this.#typeElement.parentElement.value = newValue; // hack
        }
        break;
      }
    }
  }
}

customElements.define('media-item', MediaItem);
