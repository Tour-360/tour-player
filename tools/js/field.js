
class Field extends HTMLElement {

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['value', 'label', 'type', 'step', 'status'];
  }

  connectedCallback() {
    this.shadow = this.attachShadow({mode: "open"});

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          margin: var(--margin, 12px);
        }
        
        .field {
          border-radius: 4px;
          /*background: var(--white);*/
          padding: 6px 8px;
          display: flex;
          cursor: text;
        }
        
        .field-border {
          pointer-events: none;
          display: block;
          border: 1px solid transparent;
          border-radius: 4px;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 0;
        }
        
        .field:hover .field-border {
          border-color: var(--light-gray);
          background: var(--white);
        }
        
        .field-label {
          position: relative;
          color: var(--dark-gray);
          margin-right: 6px;
          z-index: 1;
        }
        
        .field input {
          background: none;
          font: inherit;
          display: block;
          margin: 0;
          padding: 0;
          border: none;
          outline: none;
          z-index: 1;
          flex: 1;
          min-width: 0;
        }
        
        .field:not(:hover) input::-webkit-outer-spin-button,
        .field:not(:hover) input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        .field input:focus + .field-border {
          background: var(--white);
          border-color: var(--accent);
          opacity: 1;
        }
        
        .field[data-status="warning"] .field-border {
          opacity: .5;
          border-color: var(--warning) !important;
        }

      </style>
    `;

    this.labelDomElement = document.createElement('label');
    this.labelDomElement.classList.add('field');
    this.labelDomElement.setAttribute('data-status', this.getAttribute('status'));

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

    this.inputDomElement.addEventListener('keydown', function(event){
      event.stopPropagation();
    });

    this.inputDomElement.addEventListener('input', (e) => {
      e.stopPropagation();
      e.preventDefault();

      this.value = e.target.value;
      this.dispatchEvent(new Event('input'));
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value' && this.inputDomElement) {
      this.inputDomElement.value = newValue;
    } else if (name === 'status'){
      this.labelDomElement.setAttribute('data-status', newValue);
    }
  }

  set value(value) {
    this.setAttribute('value', value);
  }

  get value() {
    return this.getAttribute('value');
  }

  set status(value) {
    this.setAttribute('status', value);
  }

  get status() {
    return this.getAttribute('status');
  }
}

customElements.define('x-field', Field);

