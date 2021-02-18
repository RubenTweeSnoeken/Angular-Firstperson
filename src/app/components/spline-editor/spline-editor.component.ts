import { Component, OnInit } from '@angular/core';
import { CameraService } from 'src/app/services/camera/camera.service';
import { MeshService } from 'src/app/services/mesh/mesh.service';
import { RendererService } from 'src/app/services/renderer/renderer.service';
import { SceneService } from 'src/app/services/scene/scene.service';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { Vector3 } from 'three';


@Component({
  selector: 'app-spline-editor',
  templateUrl: './spline-editor.component.html',
  styleUrls: ['./spline-editor.component.scss']
})
export class SplineEditorComponent implements OnInit {
  container: any;
  stats: any;
  vertex = new THREE.Vector3();
  camera: any;
  color = new THREE.Color();
  scene: any;
  renderer: any;
  splineHelperObjects = [];
  splinePointsLength = 8;
  positions = [];
  point = new THREE.Vector3();
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  onUpPosition = new THREE.Vector2();
  onDownPosition = new THREE.Vector2();
  canvas: HTMLCanvasElement;
  geometry = new THREE.SphereGeometry(10, 10, 10);
  transformControl: any;
  ARC_SEGMENTS = 300;
  splines = [];
  params = {
    uniform: true,
    tension: 0.5,
    centripetal: true,
    chordal: true,
    addPoint: () => this.addPoint(),
    removePoint: () => this.removePoint(true),
    exportSpline: () => this.exportSpline()
  };

  constructor() { }

  ngOnInit(): void {
    this.init();
    this.animate();
  }

  createNewBezier(value: number) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.ARC_SEGMENTS * 3), 3));
    let curve = new THREE.CubicBezierCurve3(this.positions[this.positions.length - value], this.positions[this.positions.length - 1], this.positions[this.positions.length - 1], this.positions[this.positions.length - 1]
    );
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
      color: 0xff0000,
      opacity: 0.35,
    }));
    curve.mesh.name = (this.splines.length + 1).toString() + "_mesh";
    curve.mesh.castShadow = true;
    this.splines.push(curve);
    this.scene.add(curve.mesh);
  }

  //add point to the filed
  addPoint() {
    this.splinePointsLength++;
    let obj = this.addSplineObject().position;
    this.positions.push(obj);
    this.addBezierCurveLine();
    this.updateSplineOutline();
  }


  addBezierCurveLine() {
    let EvenNumber = this.number_test((this.positions.length / 4));
    let divided = this.positions.length / 4;
    let lastDigit = divided.toString().slice(-2);
    let spline = this.splines[this.splines.length - 1];
    console.log({ EvenNumber }, { divided }, { lastDigit }, { length: this.positions.length });
    if (divided == 0.25 && divided < 1) {
      this.createNewBezier(1);
    } else if (divided == 0.50 && divided < 1) {
      spline.v1 = this.positions[this.positions.length - 1];
      spline.v2 = this.positions[this.positions.length - 1];
      spline.v3 = this.positions[this.positions.length - 1];
    } else if (divided == 0.75 && divided < 1) {
      spline.v2 = this.positions[this.positions.length - 1];
      spline.v3 = this.positions[this.positions.length - 1];
    }
    else if (divided == 1) {
      spline.v3 = this.positions[this.positions.length - 1];
    } else {
      if (spline.v3 == spline.v2 && spline.v2 == spline.v1) {
        spline.v2 = this.positions[this.positions.length - 1];
        spline.v3 = this.positions[this.positions.length - 1];
      } else if (spline.v3 == spline.v2) {
        spline.v3 = this.positions[this.positions.length - 1];
      } else {
        this.createNewBezier(2);
      }
    }
  }

  removeBezierCurveLine() {
    let EvenNumber = this.number_test((this.positions.length / 4));
    let divided = this.positions.length / 4;
    let lastDigit = divided.toString().slice(-2);
    let spline = this.splines[this.splines.length - 1];
    console.log({ EvenNumber }, { divided }, { lastDigit }, { length: this.positions.length });
    if (divided <= 1) {
      if (lastDigit == "1") {
        spline.v3 = spline.v2;
      } else if (lastDigit == "75") {
        spline.v2 = spline.v1;
        spline.v2 = spline.v1;
        spline.v3 = spline.v1;
      } else if (lastDigit == ".5") {
        spline.v1 = spline.v0;
        spline.v2 = spline.v0;
        spline.v3 = spline.v0;
      } else if (lastDigit == "25") {
        let selectedObject = this.scene.getObjectByName(this.splines.length.toString() + "_mesh");
        this.scene.remove(selectedObject);
        this.splines.pop();
      }
    }
    else {
      if (spline.v3 != spline.v2 && spline.v2 != spline.v1) {
        spline.v3 = spline.v2;
      } else if (spline.v3 == spline.v2 && spline.v2 != spline.v1) {
        spline.v3 = spline.v1;
        spline.v2 = spline.v1;
      } else if (spline.v3 == spline.v2 && spline.v2 == spline.v1) {
        let selectedObject = this.scene.getObjectByName(this.splines.length.toString() + "_mesh");
        this.scene.remove(selectedObject);
        this.splines.pop();
      }
    }
  }

  number_test(n) {
    let result = (n - Math.floor(n)) !== 0;
    return result;
  }

  //remove point from the field
  removePoint(remove?: boolean) {
    if (remove) {
      this.removeBezierCurveLine();
    }
    const point = this.splineHelperObjects.pop();
    this.splinePointsLength--;
    this.positions.pop();
    if (this.transformControl.object === point) this.transformControl.detach();
    this.scene.remove(point);

    this.updateSplineOutline();
  }

  //update the line drawing
  updateSplineOutline() {
    for (const k in this.splines) {
      const spline = this.splines[k];
      const splineMesh = spline.mesh;
      const position = splineMesh.geometry.attributes.position;
      for (let i = 0; i < this.ARC_SEGMENTS; i++) {
        const t = i / (this.ARC_SEGMENTS - 1);
        spline.getPoint(t, this.point);
        position.setXYZ(i, this.point.x, this.point.y, this.point.z);
      }
      position.needsUpdate = true;
    }
    this.render();
  }

  //export spline with code
  exportSpline() {
    const strplace = [];
    for (let i = 0; i < this.splinePointsLength; i++) {
      const p = this.splineHelperObjects[i].position;
      strplace.push(`new THREE.Vector3(${p.x}, ${p.y}, ${p.z})`);
    }
    console.log(strplace.join(',\n'));
    const code = '[' + (strplace.join(',\n\t')) + ']';
    prompt('copy and paste code', code);
  }

  //add points
  load(new_positions) {
    while (new_positions.length > this.positions.length) {
      this.addPoint();
    }
    while (new_positions.length < this.positions.length) {
      this.removePoint();
    }
    for (let i = 0; i < this.positions.length; i++) {
      this.positions[i].copy(new_positions[i]);
    }
    this.updateSplineOutline();
  }

  //animate the 
  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
    this.stats.update();
  }

  //render the view
  render() {
    for (const k in this.splines) {
      this.splines[k].mesh.visible = this.params.uniform;
    }
    this.renderer.render(this.scene, this.camera);
  }

  //when clicking on the point
  onPointerDown(event) {
    this.onDownPosition.x = event.clientX;
    this.onDownPosition.y = event.clientY;

    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.splineHelperObjects);
    if (intersects.length > 0) {
      const object = intersects[0].object;
      if (object !== this.transformControl.object) {
        this.transformControl.attach(object);
      }
    }
  }

  //add new bullt point
  addSplineObject(position?) {
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const object = new THREE.Mesh(this.geometry, material);
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

  //init the whole project
  init() {
    this.container = document.getElementById('container');
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.set(0, 250, 1000);
    this.scene.add(this.camera);
    this.scene.add(new THREE.AmbientLight(0xf0f0f0));
    const light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 1500, 200);
    light.angle = Math.PI * 0.2;
    light.castShadow = true;
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2000;
    light.shadow.bias = - 0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add(light);

    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    planeGeometry.rotateX(- Math.PI / 2);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = - 200;
    plane.receiveShadow = true;
    this.scene.add(plane);

    const helper = new THREE.GridHelper(2000, 100);
    helper.position.y = - 199;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    this.scene.add(helper);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.stats = new Stats();
    container.appendChild(this.stats.dom);

    const gui = new GUI();
    gui.add(this.params, 'addPoint');
    gui.add(this.params, 'removePoint');
    gui.add(this.params, 'exportSpline');
    gui.open();

    // Controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.damping = 0.2;
    controls.addEventListener('change', () => this.render());

    this.transformControl = new TransformControls(this.camera, this.renderer.domElement);
    this.transformControl.addEventListener('change', () => this.render());
    this.transformControl.addEventListener('dragging-changed', function (event) {

      controls.enabled = !event.value;

    });
    this.scene.add(this.transformControl);

    this.transformControl.addEventListener('objectChange', () => {
      this.updateSplineOutline();
    });

    document.addEventListener('pointerdown', () => this.onPointerDown(event));


    /*******
     * Curves
     *********/
    this.createBeginPointsAndLine();

  }

  createBeginPointsAndLine() {
    for (let i = 0; i < this.splinePointsLength; i++) {
      this.addSplineObject(this.positions[i]);
    }
    this.positions.length = 0;
    for (let i = 0; i < this.splinePointsLength; i++) {
      this.positions.push(this.splineHelperObjects[i].position);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.ARC_SEGMENTS * 3), 3));

    let curve = new THREE.CubicBezierCurve3(this.positions[0], this.positions[1], this.positions[2], this.positions[3]
    );
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
      color: 0xff0000,
      opacity: 0.35
    }));
    curve.mesh.castShadow = true;
    curve.mesh.name = (this.splines.length + 1).toString() + "_mesh"
    this.splines.push(curve);
    const spline = this.splines;
    this.scene.add(spline[0].mesh);
    this.load(
      [
        new THREE.Vector3(389.76843686945404, 552.51481137238443, 156.10018915737797),
        new THREE.Vector3(- 153.56300074753207, 271.49711742836848, - 114.495472686253045),
        new THREE.Vector3(- 191.40118730204415, 276.4306956436485, - 106.958271935582161),
        new THREE.Vector3(- 483.785318791128, 591.1365363371675, 147.869296953772746),
      ]);
  }
}
