import { Injectable } from '@angular/core';
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }


  createLoader(scene) {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('https://threejsfundamentals.org/threejs/resources/models/windmill/windmill.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('https://threejsfundamentals.org/threejs/resources/models/windmill/windmill.obj', (root) => {
        scene.add(root);
      });
    });
  }
}
