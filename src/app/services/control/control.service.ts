import { Injectable } from '@angular/core';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor() { }


  createControls(camera: THREE.Camera, canvas: HTMLElement, x: number=0, y: number=5, z: number=0){
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(x, y, z);
    controls.update();
  }
}
