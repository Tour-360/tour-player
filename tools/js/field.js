
class Field extends HTMLElement {

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['value', 'label', 'type', 'step'];
  }

  connectedCallback() {
    this.shadow = this.attachShadow({mode: "open"});

    this.labelDomElement = document.createElement('label');
    this.labelDomElement.classList.add('field');

    this.titleDomElement = document.createElement('span');
    this.titleDomElement.classList.add('field-label');
    this.titleDomElement.innerText = this.getAttribute('label');
    this.labelDomElement.appendChild(this.titleDomElement);

    this.inputDomElement = document.createElement('input');
    this.inputDomElement.value = this.getAttribute('value');
    if (this.getAttribute('step')) {
      this.inputDomElement.step = this.getAttribute('step');
    }
    this.inputDomElement.type = this.getAttribute('type') || "text";
    this.labelDomElement.appendChild(this.inputDomElement);

    this.borderDomElement = document.createElement('span');
    this.borderDomElement.classList.add('field-border');
    this.labelDomElement.appendChild(this.borderDomElement);

    this.shadow.appendChild(this.labelDomElement);

    this.inputDomElement.addEventListener('change', (e) => {
      e.stopPropagation();
      e.preventDefault();

      this.value = e.target.value;
      this.dispatchEvent(new Event('change'));
    });

    this.inputDomElement.addEventListener('input', (e) => {
      e.stopPropagation();
      e.preventDefault();

      this.value = e.target.value;
      this.dispatchEvent(new Event('input'));
    });

    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', 'css/field.css');
    this.shadow.appendChild(linkElem);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value' && this.inputDomElement) {
      this.inputDomElement.value = newValue;
    }
  }

  set value(value) {
    this.setAttribute('value', value);
  }

  get value() {
    return this.getAttribute('value');
  }
}

customElements.define('x-field', Field);

