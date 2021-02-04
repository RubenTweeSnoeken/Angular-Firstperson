import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class MeshService {

  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  geometry: THREE.BoxGeometry;

  constructor() { }

  createMesh() {
    this.geometry = new THREE.BoxGeometry();
    this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    return this.mesh;
  }
}
