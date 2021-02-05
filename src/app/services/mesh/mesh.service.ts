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

  createMeshBox() {
    this.geometry = new THREE.BoxGeometry();
    this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    return this.mesh;
  }


  createMeshCustom() {
    const planeSize = 40;
    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = this.createTextureCustom(planeSize);
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    return mesh;
  }
  //TODO maybe move to a texture service

  createTextureCustom(planeSize: number) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    return planeMat;
  }

}
