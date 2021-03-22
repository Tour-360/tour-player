import { WebGLRenderer } from 'three';
import { Manifest } from "../types/manifest.interface";

export class Tour {
  domElement: Element;

  constructor(element: string | Element, manifest?: Manifest ) {
    console.log({ manifest, WebGLRenderer });
    if (typeof element === 'string') {
      const domElement = document.querySelector(element);
      if (!domElement) {
        throw new Error(`DOM Element ${element} not found`);
      }
      this.domElement = domElement;
    } else {
      this.domElement = element;
    }
    this.domElement.classList.add('tour-player');
    this.domElement.innerHTML = 'Tour.player'
  }
}
