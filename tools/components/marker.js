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
    let markersContainer = parentDocument.getElementById('markers');
    if (!markersContainer) {
      markersContainer = parentDocument.createElement('div');
      markersContainer.id = 'markers';
      window.opener.Tour.domElement.appendChild(markersContainer);
    }

    const markerElement = document.createElement('div');
    markerElement.classList.add('marker');

    const buttonElement = parentDocument.createElement('div');
    buttonElement.classList.add('button', type);

    markerElement.appendChild(buttonElement);
    markersContainer.appendChild(markerElement);

    buttonElement.style.position = 'static';
    buttonElement.style.margin = '0 !important';

    const css = this.dumpCSSText(buttonElement);
    markersContainer.removeChild(markerElement);
    return css;
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

  dumpCSSText(element) {
    let s = '';
    let o = getComputedStyle(element);
    for (let i = 0; i < o.length; i++) {
      s+=o[i] + ':' + o.getPropertyValue(o[i])+';';
    }
    return s;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'type') {
      this.#markerElement.style.cssText = this.getMarkerStyleByType(newValue);
    }
  }
}

customElements.define('x-marker', Marker);
