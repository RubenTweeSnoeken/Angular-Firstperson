import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CameraService } from 'src/app/services/camera/camera.service';
import { MeshService } from 'src/app/services/mesh/mesh.service';
import { RendererService } from 'src/app/services/renderer/renderer.service';
import { SceneService } from 'src/app/services/scene/scene.service';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss']
})
export class AnimationComponent implements OnInit {

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;
  public mesh: THREE.Mesh;
  public scene: THREE.Scene;
  public camera: THREE.Camera;
  public renderer: THREE.Renderer;
  public constructor(
    private cameraService: CameraService,
    private rendererService: RendererService,
    private meshService: MeshService,
    private sceneService: SceneService) {
  }

  public ngOnInit() {
    this.scene = this.sceneService.createScene();
    this.camera = this.cameraService.createCamera(0, -10, 0);

    this.renderer = this.rendererService.createRender('#c', window.innerWidth, window.innerHeight);

    this.camera.position.z = 150;

    this.sceneService.setBackgroundColor(this.scene, 'grey');
    this.animate();
    window.addEventListener('resize', () => this.rendererService.resize(this.camera, this.renderer));

    const gltfLoader = new GLTFLoader();
    gltfLoader.load('assets/models/Flamingo.glb', (mesh) => {
      this.scene.add(mesh.scene);

      const mixer = new THREE.AnimationMixer( mesh.scene );
      const clips = mesh.animations;

      // // Update the mixer on each frame
      function update () {
         mixer.update( 11 ); // TODO: deltaSeconds (-> set value for diff animframe) 
      }

      const clip = THREE.AnimationClip.findByName( clips, 'flamingo_flyA_' );
      const action = mixer.clipAction( clip );
      action.play();

      // // Play all animations
      /* clips.forEach( function ( clip ) {
           mixer.clipAction( clip ).play();
         } );*/
      update();
    });
  }

  animate() { // TODO: to animationService
    requestAnimationFrame(() => this.animate());

    this.rendererService.render(this.scene, this.camera);
  };

}
