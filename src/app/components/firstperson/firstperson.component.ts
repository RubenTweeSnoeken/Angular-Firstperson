import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import WebXRPolyfill from 'webxr-polyfill';

@Component({
  selector: 'app-firstperson',
  templateUrl: './firstperson.component.html',
  styleUrls: ['./firstperson.component.scss']
})
export class FirstpersonComponent implements OnInit {
  camera: any;
  scene: any;
  renderer: any;
  controls: any;
  times = [];
  fps: any;
  objects = [];

  raycaster: any;

  moveForward = false;
  moveBackward = false;
  moveLeft = false;
  moveRight = false;
  canJump = false;
  keypress = false;

  prevTime = performance.now();
  velocity = new THREE.Vector3();
  direction = new THREE.Vector3();
  vertex = new THREE.Vector3();
  color = new THREE.Color();

  constructor() { }





  ngOnInit(): void {
    // const polyfill = new WebXRPolyfill();
    this.refreshLoop();
    this.init();
    this.animate();
    document.body.appendChild(VRButton.createButton(this.renderer));
    this.renderer.xr.enabled = true;

    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
    });
  }

  refreshLoop() {
    window.requestAnimationFrame(() => {
      const now = performance.now();
      while (this.times.length > 0 && this.times[0] <= now - 1000) {
        this.times.shift();
      }
      this.times.push(now);
      this.fps = this.times.length;
      this.refreshLoop();
    });
    document.getElementById("fps").innerHTML = this.fps;
  }

  init() {

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.y = 10;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.scene.fog = new THREE.Fog(0xffffff, 0, 750);

    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    this.scene.add(light);

    this.controler(this.camera, this.scene);
    this.keyStrokes();

    this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

    // floor
    let floorGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    floorGeometry.rotateX(- Math.PI / 2);

    // vertex displacement
    let position = floorGeometry.attributes.position;
    this.vertextDisplacemenet(position, this.scene, floorGeometry);

    //render everything
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    //

    window.addEventListener('resize', () => this.onWindowResize());

  }

  controler(camera, scene) {
    this.controls = new PointerLockControls(camera, document.body);
    scene.add(this.controls.getObject());
  }

  keyStrokes() {

    const onKeyDown = (event) => {

      switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
          this.moveForward = true;
          break;

        case 'ArrowLeft':
        case 'KeyA':
          this.moveLeft = true;
          break;

        case 'ArrowDown':
        case 'KeyS':
          this.moveBackward = true;
          break;

        case 'ArrowRight':
        case 'KeyD':
          this.moveRight = true;
          break;

        case 'Space':
          if (this.canJump === true) this.velocity.y += 350;
          this.canJump = false;
          break;
        case 'KeyP':
          if (this.keypress == false) {
            this.controls.lock();
            this.keypress = true;
          } else {
            this.keypress = false;
          }
          break;
      }

    };

    const onKeyUp = (event) => {

      switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
          this.moveForward = false;
          break;

        case 'ArrowLeft':
        case 'KeyA':
          this.moveLeft = false;
          break;

        case 'ArrowDown':
        case 'KeyS':
          this.moveBackward = false;
          break;

        case 'ArrowRight':
        case 'KeyD':
          this.moveRight = false;
          break;
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  }


  vertextDisplacemenet(position, scene, floorGeometry) {

    for (let i = 0, l = position.count; i < l; i++) {

      this.vertex.fromBufferAttribute(position, i);

      this.vertex.x += Math.random() * 20 - 10;
      this.vertex.y += Math.random() * 2;
      this.vertex.z += Math.random() * 20 - 10;

      position.setXYZ(i, this.vertex.x, this.vertex.y, this.vertex.z);
    }

    floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

    position = floorGeometry.attributes.position;
    const colorsFloor = [];

    for (let i = 0, l = position.count; i < l; i++) {

      this.color.setHSL(0xff0000, 1, Math.random() * 0.25 + 0.75);
      colorsFloor.push(this.color.r, this.color.g, this.color.b);

    }

    floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsFloor, 1));

    const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floor);

  }

  onWindowResize() {
    console.log('resize');
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {

    requestAnimationFrame(() => this.animate());

    const time = performance.now();

    if (this.controls.isLocked === true) {

      this.raycaster.ray.origin.copy(this.controls.getObject().position);
      this.raycaster.ray.origin.y -= 10;

      const intersections = this.raycaster.intersectObjects(this.objects);

      const onObject = intersections.length > 0;

      const delta = (time - this.prevTime) / 1000;

      this.velocity.x -= this.velocity.x * 10.0 * delta;
      this.velocity.z -= this.velocity.z * 10.0 * delta;

      this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
      this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
      this.direction.normalize(); // this ensures consistent movements in all directions

      if (this.moveForward || this.moveBackward) { this.velocity.z -= this.direction.z * 1000.0 * delta; }
      if (this.moveLeft || this.moveRight) { this.velocity.x -= this.direction.x * 1000.0 * delta; }
      if (onObject === true) {

        this.velocity.y = Math.max(0, this.velocity.y);
        this.canJump = true;

      }

      this.controls.moveRight(- this.velocity.x * delta);
      this.controls.moveForward(- this.velocity.z * delta);

      this.controls.getObject().position.y += (this.velocity.y * delta); // new behavior

      if (this.controls.getObject().position.y < 10) {

        this.velocity.y = 0;
        this.controls.getObject().position.y = 10;

        this.canJump = true;
      }
    }
    this.prevTime = time;
    this.renderer.render(this.scene, this.camera);
  }



}
