class MediaItem extends HTMLElement {
  #idElement;
  #typeElement;
  #srcElement

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['id', 'type', 'src'];
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
      .media-item .preview {
        width: 64px;
        height: 64px;;
        flex: 0 0 auto;
        background-color: var(--extra-light-gray);
        margin-right: 6px;
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
    <div class="media-item">
      <div class="preview">
      </div>
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

    this.#idElement = this.shadow.querySelector('x-field[label="id"]');
    this.#srcElement = this.shadow.querySelector('x-field[label="src"]');
    this.#typeElement = this.shadow.querySelector('select[name="type"]');

    this.#idElement.id = this.getAttribute('id');
    this.#srcElement.src = this.getAttribute('src');
    this.#typeElement.value = this.getAttribute('type');

    this.#idElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setAttribute('id', e.target.value);
      this.dispatchEvent(new Event('changeId'));
    });


    this.#srcElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setAttribute('src', e.target.value);
      this.dispatchEvent(new Event('changeSrc'));
    });

    this.#typeElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setAttribute('type', e.target.value);
      this.dispatchEvent(new Event('changeType'));
    });

    // this.shadow.addEventListener('click', (e) => {
    //   e.preventDefault();
    //   e.stopImmediatePropagation();
    // })
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
