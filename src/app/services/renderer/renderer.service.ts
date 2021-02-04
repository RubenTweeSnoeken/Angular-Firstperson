import { ElementRef } from '@angular/core';
import { Injectable } from '@angular/core';
import { WebGLRenderer } from 'three';

@Injectable({
  providedIn: 'root'
})
export class RendererService {
  private renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  camera: THREE.PerspectiveCamera = null
  constructor() { }

  createRender(canvas: string, width: number, height: number) {
    this.canvas = document.querySelector(canvas);
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(width, height);
    return this.renderer;
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);
  }

  resize(camera: any, renderer: THREE.Renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    return renderer;
  }
}
