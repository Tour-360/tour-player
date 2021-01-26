class Select extends HTMLElement {
  #selectElement;

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          margin: var(--margin, 12px);
          cursor: default;
        }
        
        :host[data-status="warning"] {
          /*TODO*/
        }
        
        .select {
          background: var(--white);
          padding: 5px 7px;
          display: flex;
          align-items: center;
          border: 1px solid transparent;
          border-radius: 4px;
          box-sizing: border-box;
        }
        
        .select:hover {
          border-color: var(--light-gray);
        }
        
        .select.focus {
           border-color: var(--accent);
        }
        
        .label {
          position: relative;
          color: var(--dark-gray);
          margin-right: 6px;
          z-index: 1;
        }
        
        ::slotted(select) {
          appearance: none;
          -webkit-appearance: none;
          background: none;
          display: block;
          font-weight: inherit;
          outline: none;
          z-index: 1;
          min-width: 0;
          padding: 0;
          margin: 0;
          border: none;
          color: inherit;
        }
        
        .select:hover ::slotted(select),
        .select.focus ::slotted(select){
          flex: 1;
        }
        
        .arrow {
          width: 8px;
          height: 8px;
          background-image: url('./assets/select-arrow.svg');
          background-position: center;
          background-repeat: no-repeat;
          opacity: .5;
          margin-left: 6px;
          pointer-events: none;
          flex: 0 0 auto;
        }
        
        .select:hover .arrow,
        .select.focus .arrow {
          position: absolute;
          right: 8px;
          top: 0;
          bottom: 0;
          opacity: 1;
          margin: auto;
        }
      </style>
      
      <div class="select">
        <div class="label"><slot name="label">${this.getAttribute('label')}</slot></div>
        <slot></slot>
        <div class="arrow"></div>
      </div>
    `

    this.#selectElement = this.shadow.querySelector('.select');
    const select = this.children[0];

    select?.addEventListener('focus', () => {
      this.#selectElement.classList.add('focus');
    })

    select?.addEventListener('blur', () => {
      this.#selectElement.classList.remove('focus');
    })
  }


  static get observedAttributes() {
  }

  connectedCallback() {

  }


  attributeChangedCallback(name, oldValue, newValue) {
  }
}

customElements.define('select-wrapper', Select);
