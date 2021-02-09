import { Component, OnInit } from '@angular/core';
import { RendererService } from 'src/app/services/renderer/renderer.service';
import * as THREE from 'three';

@Component({
  selector: 'app-particles',
  templateUrl: './particles.component.html',
  styleUrls: ['./particles.component.scss']
})
export class ParticlesComponent implements OnInit {
  camera;
  scene;
  renderer;
  stats;
  material;
  mouseX = 0;
  mouseY = 0;
  canvas: HTMLCanvasElement;


  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  constructor(private rendererService: RendererService) { }

  ngOnInit(): void {
    this.init();
    this.animate();
  }

  init() {
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000);
    this.camera.position.z = 1000;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    const sprite = new THREE.TextureLoader().load('../../../assets/sprites/disc.png');

    for (let i = 0; i < 100; i++) {

      const x = 2000 * Math.random() - 1000;
      const y = 2000 * Math.random() - 1000;
      const z = 2000 * Math.random() - 1000;

      vertices.push(x, y, z);

    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    this.material = new THREE.PointsMaterial({ size: 35, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true });
    this.material.color.setHSL(1.0, 0.3, 0.7);

    const particles = new THREE.Points(geometry, this.material);
    this.scene.add(particles);


    this.canvas = document.querySelector("#C");

    this.renderer = this.rendererService.createRender('#c', window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.style.touchAction = 'none';
    document.body.addEventListener('pointermove', () => this.onPointerMove(event));


    window.addEventListener('resize', this.onWindowResize);

  }

  onWindowResize() {

    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

  }

  onPointerMove(event) {
    if (event.isPrimary === false) return;
    this.mouseX = event.clientX - this.windowHalfX;
    this.mouseY = event.clientY - this.windowHalfY;

  }

  //

  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
    //stats.update();
  }

  render() {

    const time = Date.now() * 0.00005;

    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
    this.camera.position.y += (- this.mouseY - this.camera.position.y) * 0.05;

    this.camera.lookAt(this.scene.position);

    const h = (360 * (1.0 + time) % 360) / 360;
    this.material.color.setHSL(h, 0.5, 0.5);

    this.renderer.render(this.scene, this.camera);

  }
}
