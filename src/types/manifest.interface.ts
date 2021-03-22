export interface Panorama {
  id: string;
  title?: string;
  floor?: number;
  heading?: number;
  let?: number;
  lon?: number;
  fov?: number;
}

export interface Manifest {
  title: string;
  playerVersion: string;
  panoramas: Panorama[];
}

const tour: Manifest = {
  title: "Tour",
  playerVersion: '3.0.0',
  panoramas: [{
    id: "",
    let: 0,
  }]
}

console.log(tour);
