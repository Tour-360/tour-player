class MarkerItem extends HTMLElement {
  #idElement;
  #titleElement;
  #iconElement
  #typeElement;
  #markerElement;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['id', 'title', 'icon', 'type'];
  }

  connectedCallback() {
    this.shadow = this.attachShadow({mode: "open"});

    this.shadow.innerHTML = `
    <style>
      .link-item {
        position: relative;
        display: flex;
        align-items: center;
        padding: 12px;
        box-sizing: border-box;
      }
      
      .link-item::after {
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
      
      .link-item:hover {
        /*border: 1px solid var(--light-gray);*/
        /*background: var(--extra-light-gray);*/
      }
      
      .link-item .preview {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 auto;
        cursor: pointer;
        height: 42px;
        width: 42px;
        /*background-color: var(--extra-light-gray);*/
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        margin-right: 6px;
        overflow: hidden;
      }
      
      .link-item .properties {
        flex: 1;
        min-width: 0;
      }
      
      .link-item .row {
        display: flex;
        margin: 2px 0;
      }
      
      .link-item .row > * {
        flex: 1;
        min-width: 0;
        --margin: 0 2px;
      }
      
      .select-type {
        flex: 2 !important;
      }
      
      .field-title {
        flex: 1.5 !important;
      }
      
      .link-item .controls {
        margin-left: 6px;
        opacity: 0;
      }
      
      .link-item:hover .controls {
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
    <div class="link-item">
      <div class="preview">
        <x-marker type="${this.getAttribute('icon')}"></x-marker>
      </div>
      <div class="properties">
        <div class="row">
          <x-field label="id" value="${this.getAttribute('id')}" ></x-field>
          <select-wrapper class="select-type" label="type">
            <select name="type">
              <option value="popup">popup</option>
              <option value="transition">transition</option>
            </select>
          </select-wrapper>
        </div>
        <div class="row">
          <x-field class="field-title" label="title" value="${this.getAttribute('title')}" ></x-field>
          <select-wrapper class="select-icon" label="Icon">
            <select name="icon">
              <option value="up">up</option>
              <option value="down">down</option>
              <option value="right">right</option>
              <option value="left">left</option>
              <option value="info">info</option>
              <option value="point">point</option>
            </select>
          </select-wrapper>
        </div>
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
    this.#markerElement = this.shadow.querySelector('x-marker');
    this.#iconElement = this.shadow.querySelector('select[name="icon"]');
    this.#typeElement = this.shadow.querySelector('select[name="type"]');

    this.#iconElement.value = this.getAttribute('icon');
    this.#typeElement.value = this.getAttribute('type');

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

    this.#iconElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setAttribute('icon', e.target.value);
      this.dispatchEvent(new Event('changeIcon'));
    });

    this.#typeElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setAttribute('type', e.target.value);
      this.dispatchEvent(new Event('changeType'));
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

  set type(value) {
    this.setAttribute('type', value);
  }

  get type() {
    return this.getAttribute('type');
  }

  set icon(value) {
    this.setAttribute('icon', value);
  }

  get icon() {
    return this.getAttribute('icon');
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
      case "type": {
        if (this.#markerElement) {
          this.#typeElement.value = newValue;
        }
        break;
      }
      case "icon": {
        if (this.#iconElement) {
          this.#markerElement.type = newValue;
          this.#iconElement.type = newValue;
        }
        break;
      }
    }
  }
}

customElements.define('marker-item', MarkerItem);
