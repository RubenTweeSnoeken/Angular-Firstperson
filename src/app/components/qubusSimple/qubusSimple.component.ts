import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MeshService } from 'src/app/services/mesh/mesh.service';
import { SceneService } from 'src/app/services/scene/scene.service';
import * as THREE from 'three';
import { CameraService } from '../../services/camera/camera.service';
import { RendererService } from '../../services/renderer/renderer.service';
@Component({
  selector: 'app-engine',
  templateUrl: './qubusSimple.component.html',
  styleUrls: ['./qubusSimple.component.scss']

})
export class QubusSimpleComponent implements OnInit {

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
    this.camera = this.cameraService.createCamera(0, 0, 5);

    this.renderer = this.rendererService.createRender('#c', window.innerWidth, window.innerHeight);

    this.mesh = this.meshService.createMeshBox();
    this.sceneService.addObject(this.scene, this.mesh);

    this.camera.position.z = 5;

    this.sceneService.setBackgroundColor(this.scene, 'grey');
    this.animate();
    window.addEventListener('resize', () => this.rendererService.resize(this.camera, this.renderer));
  }

  animate() { // TODO: to animationService
    requestAnimationFrame(() => this.animate());

    this.mesh.rotation.x += 0.04;
    this.mesh.rotation.y += 0.03;

    this.rendererService.render(this.scene, this.camera);
  };
}
