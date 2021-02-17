//@ts-nocheck
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


@Component({
  selector: 'app-spline-editor',
  templateUrl: './spline-editor.component.html',
  styleUrls: ['./spline-editor.component.scss']
})
export class SplineEditorComponent implements OnInit {
  container;
  stats;
  vertex = new THREE.Vector3();
  camera;
  color = new THREE.Color();
  scene;
  renderer;
  splineHelperObjects = [];
  splinePointsLength = 4;
  positions = [];
  point = new THREE.Vector3();

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  onUpPosition = new THREE.Vector2();
  onDownPosition = new THREE.Vector2();
  canvas: HTMLCanvasElement;
  geometry = new THREE.SphereGeometry(10, 10, 10);
  transformControl;

  ARC_SEGMENTS = 200;

  splines = {
    uniform: null,
    chordal: null,
    centripetal: null
  };

  params = {
    uniform: true,
    tension: 0.5,
    centripetal: true,
    chordal: true,
    addPoint: this.addPoint,
    removePoint: this.removePoint,
    exportSpline: this.exportSpline
  };

  constructor(private cameraService: CameraService,
    private rendererService: RendererService,
    private meshService: MeshService,
    private sceneService: SceneService) { }

  drawCruves() {
    this.canvas = document.querySelector("#canvas");
    var ctx = this.canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(1000, 40);
    ctx.bezierCurveTo(460, 60, 300, 120, 100, 900);
    ctx.strokeStyle = "red";
    ctx.stroke();
  }

  ngOnInit(): void {
    // this.drawCruves();
    this.init();
    this.animate();
  }

  addPoint() {
    this.splinePointsLength++;
    this.positions.push(this.addSplineObject(this.positions).position);
    this.updateSplineOutline();
  }
  removePoint() {
    if (this.splinePointsLength <= 4) {
      return;
    }
    const point = this.splineHelperObjects.pop();
    this.splinePointsLength--;
    this.positions.pop();
    if (this.transformControl.object === point) this.transformControl.detach();
    this.scene.remove(point);
    this.updateSplineOutline();
  }

  updateSplineOutline() {
    const spline = this.splines.uniform;
    const splineMesh = spline.mesh;
    const position = splineMesh.geometry.attributes.position;
    for (let i = 0; i < this.ARC_SEGMENTS; i++) {
      const t = i / (this.ARC_SEGMENTS - 1);
      spline.getPoint(t, this.point);
      position.setXYZ(i, this.point.x, this.point.y, this.point.z);
    }
    position.needsUpdate = true;
  }

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

  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
    this.stats.update();
  }

  render() {
    this.splines.uniform.mesh.visible = this.params.uniform;
    this.renderer.render(this.scene, this.camera);
  }

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

  onPointerUp(event) {
    // this.onUpPosition.x = event.clientX;
    // this.onUpPosition.y = event.clientY;
    // if (this.onDownPosition.distanceTo(this.onUpPosition) === 0) this.transformControl.detach();
  }

  onPointerMove(event) {

  }

  addSplineObject(position) {
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
    // helper.position.y = - 199;
    // helper.material.opacity = 0.25;
    // helper.material.transparent = true;
    // this.scene.add(helper);



    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.stats = Stats();
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
    document.addEventListener('pointerup', () => this.onPointerUp(event));
    document.addEventListener('pointermove', () => this.onPointerMove(event));

    /*******
     * Curves
     *********/

    for (let i = 0; i < this.splinePointsLength; i++) {
      this.addSplineObject(this.positions[i]);
    }

    this.positions.length = 0;
    for (let i = 0; i < this.splinePointsLength; i++) {
      this.positions.push(this.splineHelperObjects[i].position);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.ARC_SEGMENTS * 3), 3));
    console.log(this.positions);
    let curve = new THREE.CubicBezierCurve3(this.positions[0],this.positions[1], this.positions[2],this.positions[3]
    );
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
      color: 0xff0000,
      opacity: 0.35
    }));
    curve.mesh.castShadow = true;
    this.splines.uniform = curve;

    // let curve = new THREE.CatmullRomCurve3(this.positions);
    // curve.curveType = 'catmullrom';
    // curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
    //   color: 0xff0000,
    //   opacity: 0.35
    // }));
    // curve.mesh.castShadow = true;
    // this.splines.uniform = curve;

    // curve = new THREE.CatmullRomCurve3(this.positions);
    // curve.curveType = 'centripetal';
    // curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
    //   color: 0x00ff00,
    //   opacity: 0.35
    // }));
    // curve.mesh.castShadow = true;
    // this.splines.centripetal = curve;

    // curve = new THREE.CatmullRomCurve3(this.positions);
    // curve.curveType = 'chordal';
    // curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
    //   color: 0x0000ff,
    //   opacity: 0.35
    // }));
    // curve.mesh.castShadow = true;
    // this.splines.chordal = curve;

    const spline = this.splines.uniform;
    this.scene.add(spline.mesh);


    // ===================BEZIER TEST=====================
    // const curve1 = new THREE.CubicBezierCurve3(
    //   new THREE.Vector3(-230, 50, 100),
    //   new THREE.Vector3(-5, 15, 0),
    //   new THREE.Vector3(20, 15, 0),
    //   new THREE.Vector3(150, 0, -225)
    // );
    // const points = curve1.getPoints(50);
    // const geometry1 = new THREE.BufferGeometry().setFromPoints(points);
    // const material1 = new THREE.LineBasicMaterial({ color: 0x000000 });
    // // Create the final object to add to the scene
    // const curveObject = new THREE.Line(geometry1, material1);
    // this.scene.add(curveObject);
    //====================================================

    this.load([new THREE.Vector3(289.76843686945404, 452.51481137238443, 56.10018915737797),
    new THREE.Vector3(- 53.56300074753207, 171.49711742836848, - 14.495472686253045),
    new THREE.Vector3(- 91.40118730204415, 176.4306956436485, - 6.958271935582161),
    new THREE.Vector3(- 383.785318791128, 491.1365363371675, 47.869296953772746)]);

  }



}
