class Select extends HTMLElement {
  #selectElement;
  #valueElement;

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
        
        select,
        ::slotted(select) {
          appearance: none;
          -webkit-appearance: none;
          background: none;
          display: block;
          font-weight: inherit;
          outline: none;
          padding: 0;
          margin: 0;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          border: none;
          color: inherit;
          z-index: 2;
          opacity: 0;
        }
        
        .value {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
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
        <div class="value">123123</div>
        <slot></slot>
        <div class="arrow"></div>
      </div>
    `

    this.#selectElement = this.shadow.querySelector('.select');
    this.#valueElement = this.shadow.querySelector('.value');
    const select = this.children[0];
    this.#valueElement.innerText = this.getTextSelectedValue();

    select?.addEventListener('focus', () => {
      this.#selectElement.classList.add('focus');
    })

    select?.addEventListener('blur', () => {
      this.#selectElement.classList.remove('focus');
    })

    select?.addEventListener('change', e => {
      this.#valueElement.innerText = this.getTextSelectedValue();
    })
  }

  getTextSelectedValue() {
    const select = this.children[0];

    console.log(this.children);

    if (select) {
      for (let i = 0; i < select.children.length; i++) {
        if (select.children[i].selected) {
          return select.children[i].innerText;
        }
      }
    } else {
      return '';
    }
  }

  // getWidthSelectedOption(select) {
  //   for (let i = 0; i < select.children.length; i++) {
  //     if (select.children[i].selected) {
  //       const tempSelect = document.createElement('select');
  //       tempSelect.style.position = 'absolute';
  //       const option = document.createElement('option');
  //       option.innerText = select.children[i].innerHTML;
  //       tempSelect.appendChild(option);
  //       this.shadow.appendChild(tempSelect);
  //       const width = tempSelect.clientWidth;
  //       this.shadow.removeChild(tempSelect);
  //       return width;
  //     }
  //   }
  // }


  static get observedAttributes() {
  }

  connectedCallback() {

  }


  attributeChangedCallback(name, oldValue, newValue) {
  }
}

customElements.define('select-wrapper', Select);
