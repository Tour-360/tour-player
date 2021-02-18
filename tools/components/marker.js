class Marker extends HTMLElement {
  #markerElement;

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.#markerElement = document.createElement('div');
    this.#markerElement.style.cssText = this.getMarkerStyleByType(this.getAttribute('type'));

    this.#markerElement.style.position = 'static';
    this.#markerElement.style.margin = '0 !important';

    this.shadow.appendChild(this.#markerElement);
  }

  static get observedAttributes() {
    return ['type'];
  }

  getMarkerStyleByType(type) {
    const parentDocument = window.opener.document;
    const markersContainer = parentDocument.getElementById('markers');

    const markerElement = document.createElement('div');
    markerElement.classList.add('marker');

    const buttonElement = parentDocument.createElement('div');
    buttonElement.classList.add('button', type);

    markerElement.appendChild(buttonElement);
    markersContainer.appendChild(markerElement);

    buttonElement.style.position = 'static';
    buttonElement.style.margin = '0 !important';

    const computedStyle = getComputedStyle(buttonElement);
    const { cssText } = computedStyle;
    markersContainer.removeChild(markerElement);
    return cssText;
  }


  update() {
    const title = this.innerHTML;
  }

  set type(value) {
    this.setAttribute('type', value);
  }

  get type() {
    return this.getAttribute('type');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'type') {
      this.#markerElement.style.cssText = this.getMarkerStyleByType(newValue);
    }
  }
}

customElements.define('x-marker', Marker);
