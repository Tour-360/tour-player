class Toasts {
  constructor(selector) {
    this.domElement = document.querySelector(selector);
  }
  push(text) {
    this.domElement.innerHTML = '';
    const toastDomElement = document.createElement('div');
    toastDomElement.classList.add('toast');
    toastDomElement.innerText = text;
    this.domElement.appendChild(toastDomElement);
  }
}

const toasts = new Toasts('.toasts');
