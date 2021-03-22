import './style.scss';
import { Tour } from './Tour/Tour';

declare global {
  interface Window {
    Tour: typeof Tour;
    tour: any;
  }
}

window.Tour = Tour;

if (process.env.development) {
  window.tour = new Tour('#tour-player');
}


