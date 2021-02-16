class DropArea extends HTMLElement {
  #containerElement;
  #rippleElement;

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
        }
        .container {
          position: relative;
          overflow: hidden;
          height: 100%;
        }
        
        .container:before {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--accent);
          pointer-events: none;
          opacity: 0;
        }
        
        .container.active:before {
          opacity: .2;
        }
        
        .container.animation:before {
          animation: background 1s ease-out;
        }
        
        .ripple {
          --x: 0;
          --y: 0;
          --size: 100px;
                    
          top: calc(calc(var(--size) / -2) + var(--y));
          left: calc(calc(var(--size) / -2) + var(--x));
          position: absolute;
          width: var(--size);
          height: var(--size);
          border-radius: calc(var(--size) / 2);
          background-color: var(--accent);
          pointer-events: none;
          z-index: 1;
          transform: scale(1);
          will-change: transform;
          opacity: 0;
          animation: none;
        }
        
        .container.animation .ripple {
          animation: ripple 1s ease-out;
        }
        
        @keyframes ripple {
          from {
            opacity: .75;
            transform: scale(.001);
          }
          to {
            opacity: 0;
            transform: scale(15);
          }
        }
        @keyframes background {
          from {
            opacity: .2;
          }
          top {
            opacity: 0;
          }
        }
      </style>
      <div class="container">
        <slot></slot>
        <div class="ripple"></div>
      </div>
    `
    this.#containerElement = this.shadow.querySelector('.container');
    this.#rippleElement = this.shadow.querySelector('.ripple');

    this.#containerElement.addEventListener('dragenter', this.handleDragEnter.bind(this));
    this.#containerElement.addEventListener('dragleave', this.handleDragLeave.bind(this));
    this.#containerElement.addEventListener('dragover', this.handleDragOver.bind(this));
    this.#containerElement.addEventListener('drop', this.handleDrop.bind(this));
  }

  setActive(value) {
    this.#containerElement.classList[value? 'add' : 'remove']('active');
  }

  setAnimation(value) {
    this.#containerElement.classList[value? 'add' : 'remove']('animation');
  }

  handleDragEnter() {
    this.setAnimation(false);
    this.setActive(true);
  }

  handleDragLeave() {
    this.setActive(false);
  }

  handleDragOver(e) {
    e.preventDefault();
  }

  handleDrop(e) {
    this.setAnimation(true);
    e.preventDefault();
    e.stopPropagation();
    this.setActive(false);

    this.#rippleElement.style.setProperty('--x', e.offsetX + 'px');
    this.#rippleElement.style.setProperty('--y', e.offsetY + 'px');
    console.log(e.dataTransfer.files[0]);
  }

  // set checked(value) {
  //   this.setAttribute('checked', value);
  // }
  //
  // get checked() {
  //   return this.getAttribute('checked');
  // }

  attributeChangedCallback(name, oldValue, newValue) {
    // this.#valueElement && this.update();
  }
}

customElements.define('drop-area', DropArea);
