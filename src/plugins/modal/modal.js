window.onpopstate = (e) => {
  const modalId = e.state && e.state.modal;
  if (modalId) {
    modalContainer.open(modalId, false);
  } else {
    modalContainer.close(modalId, false);
  }
};

class ModalContainer {
  constructor(tour) {
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.container = null;
    this.modals = [];
    this.element = document.createElement("div");
    this.element.classList.add("modal-container");
    this.element.addEventListener("pointerdown", this.handleClick.bind(this));
    document
      .querySelector(tour ? tour.options.element : "body")
      .appendChild(this.element);
  }

  openFromUrl() {
    const modalId = Tour.query.get("modal");
    if (modalId) {
      this.open(modalId, false);
    }
  }

  handleClick(e) {
    if (e.target === e.currentTarget) {
      this.closeAll();
    }
  }

  handleKeyUp(e) {
    if (e.code === "Escape") {
      this.closeAll();
    }
  }

  closeAll() {
    document.removeEventListener("keyup", this.handleKeyUp);
    this.element.classList.remove("opened");
    Object.values(this.modals).forEach((modal) => {
      if (modal.opened) {
        modal.opened = false;
        modal.element.classList.remove("opened");
        Tour.emmit("modalClose");
      }
    });
    this.historyPush(null);
  }

  appendModal(modal) {
    modal.container = this;
    this.modals.push(modal);
    this.element.appendChild(modal.element);
  }

  close(modalId, history = true) {
    document.removeEventListener("keyup", this.handleKeyUp);
    this.element.classList.remove("opened");
    this.element.scroll(0, 0);
    Object.values(this.modals).forEach((modal) => {
      modal.opened = false;
      modal.element.classList.remove("opened");
    });
    Tour.emmit("modalClose", modalId);
    history && this.historyPush(null);
  }

  open(modalId, history = true) {
    let matchCounter = 0;
    this.modals.forEach((modal) => {
      const match = modal.id === modalId;
      modal.opened = match;
      modal.element.classList[match ? "add" : "remove"]("opened");
      match && matchCounter++;
    });
    if (matchCounter) {
      this.element.classList.add("opened");
      document.addEventListener("keyup", this.handleKeyUp);
      Tour.emmit("modalOpen", modalId);
    }
    history && this.historyPush(modalId);
  }

  historyPush(modalId) {
    const modal = this.modals.find((m) => m.id === modalId);
    history.pushState(
      modal
        ? {
            modal: modal.id,
          }
        : modalId,
      modal ? modal.title : "",
      Tour.query.set({
        modal: modalId,
      })
    );
  }
}

class Modal {
  constructor(title, content) {
    if (!window.modalContainer) {
      window.modalContainer = new ModalContainer();
    }
    this._id =
      Tour.query.get("modal") ||
      "modal" + (Object.keys(window.modalContainer.modals).length + 1);
    this._title = title;
    this._content = content;
    this.opened = false;
    this.element = document.createElement("div");
    this.element.classList.add("modal");
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    this.element.addEventListener("touchstart", this.handleTouchStart);

    this.headerElement = document.createElement("div");
    this.headerElement.classList.add("modal-header");

    this.titleElement = document.createElement("div");
    this.titleElement.classList.add("modal-title");

    this.closeButtonElement = document.createElement("div");
    this.closeButtonElement.classList.add("modal-close");
    this.closeButtonElement.addEventListener("click", this.close.bind(this));

    this.contentElement = document.createElement("div");
    this.contentElement.classList.add("modal-content");
    this.contentElement.addEventListener("scroll", this.handleScroll);
    this.render();

    this.headerElement.appendChild(this.titleElement);
    this.headerElement.appendChild(this.closeButtonElement);
    this.element.appendChild(this.headerElement);
    this.element.appendChild(this.contentElement);

    modalContainer.appendModal(this);
  }

  openFromUrl() {
    if (window.modalContainer) {
      window.modalContainer.openFromUrl();
    }
  }

  renderContent(modal) {
    return modal.content;
  }

  renderTitle(modal) {
    return modal.title;
  }

  get content() {
    return this._content;
  }

  set content(content) {
    this._content = content;
    if (this.contentElement) {
      this.update();
    }
  }

  get title() {
    return this._title;
  }

  set title(title) {
    this._title = title;
    if (this.contentElement) {
      this.update();
    }
  }

  get id() {
    return this._id;
  }

  set id(id) {
    if (typeof id !== "string") {
      throw new Error("Modal.id should be string");
    }
    this._id = id;
  }

  render() {
    this.renderElement(this.titleElement, this.renderTitle(this));
    this.renderElement(this.contentElement, this.renderContent(this));
  }

  renderElement(element, content) {
    element.innerHTML = "";
    if (content instanceof HTMLElement) {
      element.appendChild(content);
    } else {
      element.innerHTML = content;
    }
  }

  update() {
    this.render();
  }

  open() {
    if (this.opened) return false;
    this.opened = true;
    this.update();
    this.container.open(this.id);
  }

  close() {
    if (!this.opened) return false;
    this.opened = false;
    this.container.close();
    this.contentElement.scroll(0, 0);
  }

  remove() {
    window.modalContainer.element.removeChild(this.element);
  }

  handleScroll() {
    this.element.classList[
      this.contentElement.scrollTop > 0 ? "add" : "remove"
    ]("scrolled");
  }

  handleTouchStart(e) {
    const finger = e.touches[0];
    this.touchStart = {
      x: finger.clientX,
      y: finger.clientY,
      timeStamp: e.timeStamp,
    };
    this.element.addEventListener("touchend", this.handleTouchEnd);
    if (this.contentElement.scrollTop === 0) {
      this.element.addEventListener("touchmove", this.handleTouchMove);
    }
  }

  handleTouchEnd(e) {
    this.element.removeEventListener("touchmove", this.handleTouchMove);
    this.element.removeEventListener("touchend", this.handleTouchEnd);
    this.element.classList.remove("touched");
    this.element.style.setProperty("--offsetX", 0);
    this.element.style.setProperty("--offsetY", 0);
    this.element.style.setProperty("--scale", 1);
    this.element.style.setProperty("--radius", 0);

    const offset = this.touchMove.y - this.touchStart.y;
    const offsetRatio = offset / document.documentElement.clientHeight;
    const speed =
      (offsetRatio * 100) / (e.timeStamp - this.touchStart.timeStamp);
    if (speed > 0.15 || offsetRatio > 0.3) {
      this.close();
    }
  }

  handleTouchMove(e) {
    const finger = e.touches[0];
    this.touchMove = {
      x: finger.clientX,
      y: finger.clientY,
    };

    const rate = 0.8;

    const offsetX = finger.clientX - this.touchStart.x;
    const offsetY = finger.clientY - this.touchStart.y;
    const scale = Math.max(
      1 - Math.pow(offsetY / document.documentElement.clientHeight, 2),
      0.7
    );

    this.element.style.setProperty("--offsetX", offsetX);
    this.element.style.setProperty(
      "--radius",
      Math.max(Math.abs(offsetX), Math.abs(offsetY))
    );

    if (offsetY >= 0) {
      this.element.classList.add("touched");
      this.element.style.setProperty("--offsetY", offsetY);
      this.element.style.setProperty("--scale", scale);
    }
  }
}

const appHeight = () => {
  document.documentElement.style.setProperty(
    "--app-height",
    `${window.innerHeight}px`
  );
};

window.addEventListener("resize", appHeight);
appHeight();
