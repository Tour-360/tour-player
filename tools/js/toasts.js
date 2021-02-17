class Toasts {
  constructor(selector) {
    this.timeout = null;
    this.domElement = document.querySelector(selector);
  }
  push(text, timeout = 5000) {
    this.domElement.innerHTML = '';
    const toastDomElement = document.createElement('div');
    toastDomElement.classList.add('toast');
    toastDomElement.innerText = text;
    this.domElement.appendChild(toastDomElement);

    this.timeout && clearTimeout(this.timeout);
    if (timeout) {
      this.timeout = setTimeout(() => {
        toastDomElement.classList.add('hidden');
      }, timeout);
    } else {
      toastDomElement.classList.add('loader');
    }
  }
}

const toasts = new Toasts('.toasts');
