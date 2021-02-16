class CheckBox extends HTMLElement {
  #containerElement;
  #checked;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['checked', 'title'];
  }

  connectedCallback() {
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

  handleClick() {
    this.checked = this.#containerElement.classList.toggle('checked');
    this.dispatchEvent(new Event('change'));
  }

  set checked(value) {
    this.setAttribute('checked', value);
  }

  get checked() {
    return this.getAttribute('checked');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // this.#valueElement && this.update();
  }
}

customElements.define('check-box', CheckBox);
