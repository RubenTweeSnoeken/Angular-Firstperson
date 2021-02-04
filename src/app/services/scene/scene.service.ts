import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class SceneService {
  constructor() {
  }

  createScene(): THREE.Scene {
    let scene = new THREE.Scene();
    // logic
    return scene;
  }

  setBackgroundColor(scene: THREE.Scene, color: string) {
    scene.background = new THREE.Color(color);
  }

  addObject(scene: THREE.Scene, mesh: THREE.Object3D) {
    scene.add(mesh);
  }
}
