Math.easeInOutQuad = function (t, b, c, d) {
  t /= d/2;
  if (t < 1) {
    return c/2*t*t + b
  }
  t--;
  return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInCubic = function(t, b, c, d) {
  var tc = (t/=d)*t*t;
  return b+c*(tc);
};

Math.inOutQuintic = function(t, b, c, d) {
  var ts = (t/=d)*t,
    tc = ts*t;
  return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
};

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
var requestAnimFrame = (function(){
  return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();

function scrollTo(element, to, callback, duration) {
  // because it's so fucking difficult to detect the scrolling element, just move them all
  function move(amount) {
    // document.documentElement.scrollTop = amount;
    // document.body.parentNode.scrollTop = amount;
    element.scroll(amount, 0);
  }
  function position() {
    return element.scrollLeft;
  }
  var start = position(),
    change = to - start,
    currentTime = 0,
    increment = 20;
  duration = (typeof(duration) === 'undefined') ? 300 : duration;
  var animateScroll = function() {
    // increment the time
    currentTime += increment;
    // find the value with the quadratic in-out easing function
    var val = Math.easeInOutQuad(currentTime, start, change, duration);
    // move the document.body
    move(val);
    // do the animation unless its over
    if (currentTime < duration) {
      requestAnimFrame(animateScroll);
    } else {
      if (callback && typeof(callback) === 'function') {
        // the animation is done so lets callback
        callback();
      }
    }
  };
  animateScroll();
}

class ScrollBox extends HTMLElement {
  #wrapperElement;
  #buttonLeftElement;
  #buttonRightElement;

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });

    this.shadow.innerHTML = `
      <style>    
        :host {
          display: flex;
          position: relative;
          overflow: hidden;
          margin: var(--margin, 0);
        }
        
        .wrapper {
          position: relative;
          display: flex;
          margin-bottom: calc(var(--scrollbar-size, 0) * -1px);
        }
        
        .button {
          position: absolute;
          top: 0;
          background: white;
          width: 24px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
          font-size: 8px;
          color: var(--dark-gray);
          cursor: pointer;
          pointer-events: none;
          opacity: 0;
          transition: opacity.2s ease;
        }
        
        .button.visible {
          opacity: 1;
          pointer-events: all;
        }
        
        .button:hover {
          color: var(--black);
        }
        
        .button:active {
          background-color: var(--extra-light-gray);
        }
        
        .button::before {
          content: '';
          position: absolute;
          display: block;
          width: 8px;
          height: 100%;
          pointer-events: none;
          border-left: 1px solid var(--light-gray);
          background: linear-gradient(90deg, rgba(0,0,0, .08) 0%, rgba(255,255,255,0) 100%);
        }
        
        .button.left {
          left: 0;
        }
        
        .button.right {
          right: 0;
        }
        
        .button.left::before {
          right: -8px;
        }
        
        .button.right::before {
          left: -8px;
          transform: rotate(180deg);
        }
        
        .wrapper.scrolled {
          overflow-x: scroll;
        }
        .wrapper.scrolled::-webkit-scrollbar {
          -webkit-appearance: none;
        }
      </style>
      <div class="button left">◀</div>
      <div class="wrapper">
        <slot></slot>
      </div>
      <div class="button right">▶︎</div>
    `

    this.#wrapperElement = this.shadow.querySelector('.wrapper');
    this.#buttonLeftElement = this.shadow.querySelector('.left');
    this.#buttonRightElement = this.shadow.querySelector('.right');

    this.#wrapperElement.addEventListener('scroll', this.handleScroll.bind(this));
    this.#buttonLeftElement.addEventListener('click', this.handleLeft.bind(this));
    this.#buttonRightElement.addEventListener('click', this.handleRight.bind(this));
  }

  static get observedAttributes() {
    return [];
  }

  handleScroll() {
    const width = this.#wrapperElement.clientWidth;
    const scrollWidth = this.#wrapperElement.scrollWidth;
    const scrollLeft = this.#wrapperElement.scrollLeft;

    this.#buttonLeftElement.classList[scrollLeft > 0 ? 'add' : 'remove']('visible');
    this.#buttonRightElement.classList[scrollWidth - width - scrollLeft > 0 ? 'add' : 'remove']('visible');
  }

  handleLeft() {
    const width = this.#wrapperElement.clientWidth - 48;
    const scrollLeft = this.#wrapperElement.scrollLeft;

    scrollTo(this.#wrapperElement,scrollLeft - width, 500);
  }

  handleRight() {
    const width = this.#wrapperElement.clientWidth - 48;
    const scrollLeft = this.#wrapperElement.scrollLeft;

    scrollTo(this.#wrapperElement,scrollLeft + width, 500);
  }

  connectedCallback() {
    const regularHeight = this.clientHeight;
    this.#wrapperElement.classList.add('scrolled');
    const scrolledHeight = this.clientHeight;
    const scrollbarSize = scrolledHeight - regularHeight;
    this.#wrapperElement.style.setProperty('--scrollbar-size', scrollbarSize);
    this.handleScroll();
  }


  attributeChangedCallback(name, oldValue, newValue) {
  }
}

customElements.define('scroll-box', ScrollBox);
