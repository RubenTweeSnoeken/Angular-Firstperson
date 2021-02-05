import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { CameraService } from 'src/app/services/camera/camera.service';
import { LightService } from 'src/app/services/light/light.service';
import { RendererService } from 'src/app/services/renderer/renderer.service';
import { SceneService } from 'src/app/services/scene/scene.service';
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
  public clock: THREE.Clock;

  // For animation
  mixer: THREE.AnimationMixer;

  public constructor(
    private cameraService: CameraService,
    private rendererService: RendererService,
    private sceneService: SceneService,
    private lightService: LightService) {
  }

  public ngOnInit() {
    this.clock = new THREE.Clock();
    
    // Create basis scene
    this.scene = this.sceneService.createScene();
    this.camera = this.cameraService.createCamera(0, -10, 0);

    this.renderer = this.rendererService.createRender('#c', window.innerWidth, window.innerHeight);

    this.camera.position.z = 150;

    this.sceneService.setBackgroundColor(this.scene, 'grey');
    window.addEventListener('resize', () => this.rendererService.resize(this.camera, this.renderer));

    let light = this.lightService.createAmbientLight("#FFFFFF", 0, 0, 0, 1000);
    this.scene.add(light);

    // Load object
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('assets/models/Flamingo.glb', (mesh) => {
      this.scene.add(mesh.scene);

      // Animation stuff
      this.mixer = new THREE.AnimationMixer( mesh.scene );
      const clips = mesh.animations;

      const clip = THREE.AnimationClip.findByName( clips, 'flamingo_flyA_' );
      const action = this.mixer.clipAction( clip );
      action.play();      
      
      this.animate();
    });
  }

  animate() { // TODO: to animationService
    const dt = this.clock.getDelta();

    requestAnimationFrame(() => this.animate());

    if ( this.mixer ) this.mixer.update( dt );

    this.rendererService.render(this.scene, this.camera);
  }
}
