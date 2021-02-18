class AreaItem extends HTMLElement {
  #idElement;
  #titleElement;
  #actionElement;
  #previewElement;
  #mediaElement;
  #typeElement;
  #rowMediaElement;
  #mediaList;

  constructor() {
    super();
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
        display: flex;
        flex-direction: column;
        margin-left: 6px;
        opacity: 0;
      }
      
      .area-item:hover .controls {
        opacity: 1;
      }
      
      .area-item .row {
        display: flex;
        margin: 2px 0;
      }
      
      .area-item .row.hidden {
        display: none;
      }
      
      .area-item .row > * {
        flex: 1;
        min-width: 0;
        --margin: 0 2px;
      }
      
      select-wrapper {
        flex: 2 !important;
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
      
      button.media {
        background-image: url('assets/media.svg');
      }
    </style>
    <div class="area-item">
      <div class="preview"></div>
      <div class="properties">
        <div class="row">
          <x-field label="title" value="${this.getAttribute('title')}" ></x-field>
          <x-field label="id" value="${this.getAttribute('id')}" ></x-field>
        </div>
        <div class="row">
          <select-wrapper label="type">
            <select name="type">
              <option value="shape">shape</option>
              <option value="media">media</option>
              <option value="mask">mask</option>
            </select>
          </select-wrapper>
          <select-wrapper label="action">
            <select name="action">
              <option value="popup">popup</option>
              <option value="transition">transition</option>
              <option value="none">none</option>
            </select>
          </select-wrapper>
        </div>
        <div class="row row-media">
          <select-wrapper label="media">
            <select name="media"></select>
          </select-wrapper>
        </div>
      </div>
      <div class="controls">
        <button class="delete" title="Remove"></button>
<!--        <button class="media" title="Media"></button>-->
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
    this.#mediaElement = this.shadow.querySelector('select[name="media"]');
    this.#typeElement = this.shadow.querySelector('select[name="type"]');
    this.#actionElement = this.shadow.querySelector('select[name="action"]');
    this.#previewElement = this.shadow.querySelector('.preview');
    this.#rowMediaElement = this.shadow.querySelector('.row-media');

    this.#actionElement.value = this.getAttribute('action');
    this.#previewElement.style.backgroundImage = `url("${this.getAttribute('image')}")`;

    this.#idElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setAttribute('id', e.target.value);
      this.dispatchEvent(new Event('changeId'));
    });

    this.#actionElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setAttribute('action', e.target.value);
      this.dispatchEvent(new Event('changeAction'));
    });

    this.#titleElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setAttribute('title', e.target.value);
      this.dispatchEvent(new Event('changeTitle'));
    });

    this.#typeElement.addEventListener('change', (e) => {
      const value = e.target.value;
      e.preventDefault();
      e.stopPropagation();
      this.setAttribute('type', e.target.value);
      this.dispatchEvent(new Event('changeType'));
    });

    this.#mediaElement.addEventListener('change', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setAttribute('media', e.target.value);
      this.dispatchEvent(new Event('changeMedia'));
    });

    this.shadow.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    })
  }

  static get observedAttributes() {
    return ['id', 'title', 'image', 'action', 'media', 'type'];
  }

  connectedCallback() {

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

  set action(value) {
    this.setAttribute('action', value);
  }

  get action() {
    return this.getAttribute('action');
  }

  set image(value) {
    this.setAttribute('image', value);
  }

  get image() {
    return this.getAttribute('image');
  }

  set type(value) {
    this.setAttribute('type', value);
  }

  get type() {
    return this.getAttribute('type');
  }

  set media(value) {
    this.setAttribute('media', value);
  }

  get media() {
    return this.getAttribute('media');
  }

  set mediaList(list) {
    this.#mediaList = list;
    this.#mediaElement.innerHTML = '';
    list.forEach(item => {
      const option = document.createElement('option');
      option.innerText = item;
      option.value = item;
      this.#mediaElement.appendChild(option);
    })
  }

  get mediaList() {
    return this.#mediaList;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.dispatchEvent(new Event('change'));

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
      case "action": {
        if (this.#actionElement) {
          this.#actionElement.parentElement.value = newValue; // hack
          this.#actionElement.value = newValue;
        }
        break;
      }
      case "type": {
        if (this.#typeElement) {
          this.#typeElement.parentElement.value = newValue; // hack
          this.#typeElement.value = newValue;
          this.#rowMediaElement.classList[newValue !== 'media' ? 'add' : 'remove']('hidden');
        }
        break;
      }
      case "media": {
        if (this.#mediaElement) {
          this.#mediaElement.parentElement.value = newValue; // hack
          this.#mediaElement.value = newValue;
        }
        break;
      }
    }
  }
}

customElements.define('area-item', AreaItem);
