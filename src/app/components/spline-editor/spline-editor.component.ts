import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {CubicBezierCurve3, Vector3} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls.js';

@Component({
  selector: 'app-spline-editor',
  templateUrl: './spline-editor.component.html',
  styleUrls: ['./spline-editor.component.scss']
})
export class SplineEditorComponent implements OnInit {
  container: HTMLElement;
  camera: THREE.Camera;
  color = new THREE.Color();
  scene: THREE.Scene;
  vec: Vector3;
  pos: Vector3;
  renderer: THREE.WebGLRenderer;
  splineHelperObjects: THREE.Mesh[] = [];
  positions: Vector3[] = [];
  point = new THREE.Vector3();
  rayCaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  onUpPosition = new THREE.Vector2();
  onDownPosition = new THREE.Vector2();
  canvas: HTMLCanvasElement;
  geometry = new THREE.SphereGeometry(10, 10, 10);
  transformControl: TransformControls;
  ARC_SEGMENTS = 300;
  splines: CubicBezierCurve3[] = [];
  splineLinesMeshes: THREE.Line[] = [];

  constructor() {
  }


  keyStrokes() {
    const onKeyDown = (event) => {
      switch (event.code) {
        case 'KeyA':
          this.addPoint(this.pos);
          break;
        case 'KeyD':
          this.removePoint(true);
          break;
        case 'KeyP':
          this.transformControl.detach();
          break;
      }
    };
    document.addEventListener('pointermove', (event) => this.onPointerMove(event));
    document.addEventListener('keydown', onKeyDown);
  }

  onPointerMove(event: MouseEvent) {
    if (!this.vec && !this.pos) {
      this.vec = new THREE.Vector3(); // create once and reuse
      this.pos = new THREE.Vector3(); // create once and reuse
    }
    this.vec.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5);

    this.vec.unproject(this.camera);
    this.vec.sub(this.camera.position).normalize();
    const distance = -this.camera.position.z / this.vec.z;
    this.pos.copy(this.camera.position).add(this.vec.multiplyScalar(distance));


    // const raycaster = new THREE.Raycaster(); // create once
    // const mouse = new THREE.Vector2(); // create once
    //
    //
    // mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    // mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
    //
    // raycaster.setFromCamera(mouse, this.camera);
    // this.pos = (raycaster.ray.origin);
  }


  ngOnInit(): void {
    this.init();
    this.keyStrokes();
    this.animate();
  }

  createNewBezier(value: number) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.ARC_SEGMENTS * 3), 3));
    const curve = new THREE.CubicBezierCurve3(
      this.positions[this.positions.length - value],
      this.positions[this.positions.length - 1],
      this.positions[this.positions.length - 1],
      this.positions[this.positions.length - 1]
    );
    const mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
      color: 0xff0000,
      opacity: 0.35,
    }));
    mesh.name = (this.splines.length + 1).toString() + '_mesh';
    mesh.castShadow = true;
    this.splines.push(curve);
    this.splineLinesMeshes.push(mesh);
    this.scene.add(mesh);
  }

  // add point to the filed
  addPoint(position?: Vector3) {
    const obj = this.addSplineObject(position).position;
    this.positions.push(obj);
    this.addBezierCurveLine();
    this.updateSplineOutline();
  }

  addBezierCurveLine() {
    const spline = this.splines[this.splines.length - 1];
    if (this.positions.length <= 4) {
      if (this.positions.length === 1) {
        this.createNewBezier(1);
        this.splineHelperObjects[this.splineHelperObjects.length - 1].type = 'main';
      } else if (this.positions.length === 2) {
        spline.v1 = this.positions[this.positions.length - 1];
        spline.v2 = this.positions[this.positions.length - 1];
        spline.v3 = this.positions[this.positions.length - 1];
        this.splineHelperObjects[this.splineHelperObjects.length - 1].type = 'first';
      } else if (this.positions.length === 3) {
        spline.v2 = this.positions[this.positions.length - 1];
        spline.v3 = this.positions[this.positions.length - 1];
        this.splineHelperObjects[this.splineHelperObjects.length - 1].type = 'second';
      } else if (this.positions.length === 4) {
        spline.v3 = this.positions[this.positions.length - 1];
        this.splineHelperObjects[this.splineHelperObjects.length - 1].type = 'main';
      }
    } else {
      if (spline.v3.equals(spline.v2) && spline.v2.equals(spline.v1)) {
        spline.v2 = this.positions[this.positions.length - 1];
        spline.v3 = this.positions[this.positions.length - 1];
        this.splineHelperObjects[this.splineHelperObjects.length - 1].type = 'second';
      } else if (spline.v3.equals(spline.v2)) {
        spline.v3 = this.positions[this.positions.length - 1];
        this.splineHelperObjects[this.splineHelperObjects.length - 1].type = 'main';
      } else {
        this.createNewBezier(2);
        this.splineHelperObjects[this.splineHelperObjects.length - 1].type = 'first';
      }
    }
  }

  removeBezierCurveLine() {
    const spline = this.splines[this.splines.length - 1];
    if (this.positions.length <= 4) {
      if (this.positions.length === 4) {
        spline.v3 = spline.v2;
      } else if (this.positions.length === 3) {
        spline.v2 = spline.v1;
        spline.v3 = spline.v1;
      } else if (this.positions.length === 2) {
        spline.v1 = spline.v0;
        spline.v2 = spline.v0;
        spline.v3 = spline.v0;
      } else if (this.positions.length === 1) {
        const selectedObject = this.scene.getObjectByName(this.splines.length.toString() + '_mesh');
        this.scene.remove(selectedObject);
        this.splines.pop();
        this.splineLinesMeshes.pop();
      }
    } else {
      if (!spline.v3.equals(spline.v2) && !spline.v2.equals(spline.v1)) {
        spline.v3 = spline.v2;
      } else if (spline.v3.equals(spline.v2) && !spline.v2.equals(spline.v1)) {
        spline.v3 = spline.v1;
        spline.v2 = spline.v1;
      } else if (spline.v3.equals(spline.v2) && spline.v2.equals(spline.v1)) {
        const selectedObject = this.scene.getObjectByName(this.splines.length.toString() + '_mesh');
        this.scene.remove(selectedObject);
        this.splines.pop();
        this.splineLinesMeshes.pop();
      }
    }
  }

  // remove point from the field
  removePoint(remove?: boolean) {
    if (remove) {
      this.removeBezierCurveLine();
    }
    const point = this.splineHelperObjects.pop();
    this.positions.pop();
    if (this.transformControl.object === point) {
      this.transformControl.detach();
    }
    this.scene.remove(point);
    this.updateSplineOutline();
  }

  // update the line drawing
  updateSplineOutline() {
    for (let k = 0; k < this.splines.length; k++) {
      const spline = this.splines[k];
      const splineMesh = this.splineLinesMeshes[k];
      const position = splineMesh.geometry.attributes.position;
      for (let i = 0; i < this.ARC_SEGMENTS; i++) {
        const t = i / (this.ARC_SEGMENTS - 1);
        spline.getPoint(t, this.point);
        position.setXYZ(i, this.point.x, this.point.y, this.point.z);
      }
      position.needsUpdate = true;
    }
    if (this.transformControl.object) {
      const index = this.splineHelperObjects.findIndex(item => item.uuid === this.transformControl.object.uuid);
      if (this.transformControl.object.type === 'main' && index !== 0 && this.positions[index + 1]) {
        this.positions[index - 1].x = (2 * this.positions[index].x) - (this.positions[index + 1].x);
        this.positions[index - 1].y = (2 * this.positions[index].y) - (this.positions[index + 1].y);
        this.positions[index - 1].z = (2 * this.positions[index].z) - (this.positions[index + 1].z);
      } else if (this.transformControl.object.type === 'first' && index !== 0 && this.positions[index - 2]) {
        this.positions[index - 2].x = (2 * this.positions[index - 1].x) - (this.positions[index].x);
        this.positions[index - 2].y = (2 * this.positions[index - 1].y) - (this.positions[index].y);
        this.positions[index - 2].z = (2 * this.positions[index - 1].z) - (this.positions[index].z);
      } else if (this.transformControl.object.type === 'second' && index !== 0 && this.positions[index + 2]) {
        this.positions[index + 2].x = (2 * this.positions[index + 1].x) - (this.positions[index].x);
        this.positions[index + 2].y = (2 * this.positions[index + 1].y) - (this.positions[index].y);
        this.positions[index + 2].z = (2 * this.positions[index + 1].z) - (this.positions[index].z);
      }
    }
    this.render();
  }

  // animate the
  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
    // this.stats.update();
  }

  // render the view
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  // when clicking on the point
  onPointerDown(event: MouseEvent) {
    this.onDownPosition.x = event.clientX;
    this.onDownPosition.y = event.clientY;
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.rayCaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.rayCaster.intersectObjects(this.splineHelperObjects);
    if (intersects.length > 0) {
      const object = intersects[0].object;
      if (object !== this.transformControl.object) {
        this.transformControl.attach(object);
      }
    }
  }

  // add new bullt point
  addSplineObject(position?: Vector3, objectType?: string) {
    const material = new THREE.MeshLambertMaterial({color: 0x000000});
    const object = new THREE.Mesh(this.geometry, material);
    object.type = objectType;
    if (position) {
      object.position.copy(position);
    } else {
      object.position.x = Math.random() * 1000 - 500;
      object.position.y = Math.random() * 600;
      object.position.z = Math.random() * 800 - 400;
    }
    object.castShadow = true;
    object.receiveShadow = true;
    this.scene.add(object);
    this.splineHelperObjects.push(object);
    return object;
  }

  createLight() {
    const light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 1500, 200);
    light.angle = Math.PI * 0.2;
    light.castShadow = true;
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2000;
    light.shadow.bias = -0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add(light);
  }

  // init the whole project
  init() {
    this.container = document.getElementById('container');
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000000000);
    this.camera.position.set(0, 250, 1000);
    this.scene.add(this.camera);
    this.scene.add(new THREE.AmbientLight(0xf0f0f0));
    this.createLight();
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    planeGeometry.rotateX(-Math.PI / 2);
    const planeMaterial = new THREE.ShadowMaterial({opacity: 0.2});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -200;
    plane.receiveShadow = true;
    this.scene.add(plane);
    const helper = new THREE.GridHelper(2000, 100);
    helper.position.y = -199;
    (helper.material as THREE.Material).opacity = 0.25;
    (helper.material as THREE.Material).transparent = true;
    this.scene.add(helper);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
    this.createControls();

    this.addPoint(new THREE.Vector3(389.76843686945404, 552.51481137238443, 156.10018915737797));
    this.addPoint(new THREE.Vector3(-153.56300074753207, 271.49711742836848, -114.495472686253045));
    this.addPoint(new THREE.Vector3(-191.40118730204415, 276.4306956436485, -106.958271935582161));
    this.addPoint(new THREE.Vector3(-483.785318791128, 591.1365363371675, 147.869296953772746));

  }

  createControls() {
    // Controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.dampingFactor = 0.2;
    controls.addEventListener('change', () => this.render());
    this.transformControl = new TransformControls(this.camera, this.renderer.domElement);
    this.transformControl.addEventListener('change', () => {
      this.render();
    });
    this.transformControl.addEventListener('dragging-changed', (event) => {
      controls.enabled = !event.value;
    });
    this.scene.add(this.transformControl);
    this.transformControl.addEventListener('objectChange', () => {
      this.updateSplineOutline();
    });
    document.addEventListener('pointerdown', (event) => this.onPointerDown(event));
  }
}
