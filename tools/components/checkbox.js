class CheckBox extends HTMLElement {
  #containerElement;

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          margin: var(--margin, 12px);
        }
        
        .container {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .check {
          width: 16px;
          height: 16px;
          background-color: var(--white);
          border: 1px solid var(--light-gray);
          border-radius: 4px;
          flex: 0 0 auto;
          margin-right: 8px;
          box-sizing: border-box;
          background-size: 100%;
          background-repeat: no-repeat;
          background-position: center;
        }
        .container.checked .check {
          background-image: url('./assets/check.svg');
          border: none;
          background-color: var(--accent);
        }
        .container.checked:hover .check {
          background-color: var(--accent-dark);
        }
        .container:not(.checked):hover .check {
          border-color: var(--dark-gray);
        }
        .container:active {
          opacity: .75;
        }
      </style>
      <div class="container">
        <div class="check"></div>
        <div class="title"><slot></slot></div>
      </div>
    `
    this.#containerElement = this.shadow.querySelector('.container');

    this.#containerElement.addEventListener('click', this.handleClick.bind(this));
  }

  static get observedAttributes() {
    return ['checked', 'title'];
  }

  connectedCallback() {

  }

  handleClick() {
    this.checked = this.#containerElement.classList.toggle('checked');
    this.dispatchEvent(new Event('change'));
  }

  set checked(value) {
    this[value ? 'setAttribute' : 'removeAttribute']('checked', 'checked');
  }

  get checked() {
    return this.hasAttribute('checked');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // this.#valueElement && this.update();
    if (name === 'checked') {
      this.#containerElement.classList[newValue ? 'add' : 'remove']('checked');
    }
  }
}

customElements.define('check-box', CheckBox);
