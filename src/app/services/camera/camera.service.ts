import { Injectable } from '@angular/core';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  camera: THREE.PerspectiveCamera = null

  constructor() { }

  public createCamera(x: number, y: number, z: number, fov: number = 75, aspect: number = window.innerWidth / window.innerHeight, near: number = 0.1, far: number = 1000) {
    this.camera = new THREE.PerspectiveCamera(
      fov, aspect, near, far
    );
    this.camera.position.x = x;
    this.camera.position.y = y;
    this.camera.position.z = z;
    return this.camera;
  }
}
