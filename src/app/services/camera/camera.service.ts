import { Injectable } from '@angular/core';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  camera: THREE.PerspectiveCamera = null

  constructor() { }

  public createCamera(x: number, y: number, z: number) {
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.x = x;
    this.camera.position.y = y;
    this.camera.position.z = z;
    return this.camera;
  }
}
