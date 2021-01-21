class Bar extends HTMLElement {
  #titleElement;
  #valueElement;
  #secondaryValueElement;
  #labelsElement;
  #labelValueElement;
  #labelMaxElement;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['max', 'value', 'postfix', 'secondary-value', 'hidden-labels'];
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });

    this.shadow.innerHTML = `
      <style>
        :host {
          margin: var(--margin, 12px);
        }
        
        .title {
          display: block;
          font-weight: 400;
          color: var(--dark-gray);
          margin-top: 2px;
          margin-bottom: 8px;
        }
        
        .title:empty {
          display: none;
        }
        
        .line {
          overflow: hidden;
          border-radius: 2px;
          position: relative;
          width: 100%;
          height: 4px;
          background: var(--extra-light-gray);
        }
        
        .value,
        .secondary-value {
          height: 100%;
          width: 0;
          position: absolute;
          background: var(--light-gray);
        }
        
        .value {
          background: var(--accent);
        }
        
        .labels {
          margin-top: 6px;
          display: flex;
          justify-content: space-between;
          color: var(--dark-gray);
          font-size: 10px;
        }
        
        .labels.hidden {
          display: none;
        }
      </style>
      <div class="x-bar">
        <span class="title">title</span>
        <div class="line">
          <div class="secondary-value"></div>
          <div class="value"></div>
        </div>
        <div class="labels">
          <div class="label-value">100mb</div>
          <div class="label-max">1000mb</div>
        </div>
      </div>
    `
    this.#valueElement = this.shadow.querySelector('.value');
    this.#secondaryValueElement = this.shadow.querySelector('.secondary-value');
    this.#labelsElement = this.shadow.querySelector('.labels');
    this.#labelValueElement = this.shadow.querySelector('.label-value');
    this.#labelMaxElement = this.shadow.querySelector('.label-max');
    this.#titleElement = this.shadow.querySelector('.title');

    this.update();
  }

  update() {
    const title = this.innerHTML;
    const value = parseFloat(this.getAttribute('value')) || 0;
    const secondaryValue = parseFloat(this.getAttribute('secondary-value')) || 0;
    const max = parseFloat(this.getAttribute('max')) || 100;
    const postfix = this.getAttribute('postfix') || "";
    this.#labelsElement.classList[this.hasAttribute('hidden-labels') ? 'remove' : 'add']('hidden');

    this.#titleElement.innerHTML = title;
    this.#valueElement.style.width = value / max * 100 + '%';
    this.#secondaryValueElement.style.width = secondaryValue / max * 100 + '%';
    this.#labelValueElement.innerText = value + postfix;
    this.#labelMaxElement.innerText = max + postfix;

  }

  set value(value) {
    this.setAttribute('value', value);
  }

  get value() {
    return this.getAttribute('value');
  }

  set secondaryValue(value) {
    this.setAttribute('secondary-value', value);
  }

  get secondaryValue() {
    return this.getAttribute('secondary-value');
  }

  set max(value) {
    this.setAttribute('max', value);
  }

  get max() {
    return this.getAttribute('max');
  }

  set postfix(value) {
    this.setAttribute('postfix', value);
  }

  get postfix() {
    return this.getAttribute('postfix');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.#valueElement && this.update();
  }
}

customElements.define('x-bar', Bar);
