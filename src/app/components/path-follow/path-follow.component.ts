import {Component, OnInit} from '@angular/core';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GUI} from 'three/examples/jsm/libs/dat.gui.module.js';
import * as THREE from 'three';
import {Curves} from 'three/examples/jsm/curves/CurveExtras.js';

@Component({
  selector: 'app-path-follow',
  templateUrl: './path-follow.component.html',
  styleUrls: ['./path-follow.component.scss']
})
export class PathFollowComponent implements OnInit {

  container: HTMLElement;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  splineCamera: THREE.PerspectiveCamera;
  cameraHelper: THREE.CameraHelper;
  cameraEye: THREE.Mesh;

  direction: THREE.Vector3;
  binormal: THREE.Vector3;
  normal: THREE.Vector3;
  position: THREE.Vector3;
  lookAt: THREE.Vector3;

  pipeSpline: THREE.CatmullRomCurve3;
  sampleClosedSpline: THREE.CatmullRomCurve3;
  splines: any;
  parent: THREE.Object3D;
  tubeGeometry: THREE.TubeGeometry;
  mesh: THREE.Mesh;
  params: any;
  material: THREE.MeshLambertMaterial;
  wireframeMaterial: THREE.MeshBasicMaterial;

  constructor() {
    this.direction = new THREE.Vector3();
    this.binormal = new THREE.Vector3();
    this.normal = new THREE.Vector3();
    this.position = new THREE.Vector3();
    this.lookAt = new THREE.Vector3();
    this.pipeSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 10, -10), new THREE.Vector3(10, 0, -10),
      new THREE.Vector3(20, 0, 0), new THREE.Vector3(30, 0, 10),
      new THREE.Vector3(30, 0, 20), new THREE.Vector3(20, 0, 30),
      new THREE.Vector3(10, 0, 30), new THREE.Vector3(0, 0, 30),
      new THREE.Vector3(-10, 10, 30), new THREE.Vector3(-10, 20, 30),
      new THREE.Vector3(0, 30, 30), new THREE.Vector3(10, 30, 30),
      new THREE.Vector3(20, 30, 15), new THREE.Vector3(10, 30, 10),
      new THREE.Vector3(0, 30, 10), new THREE.Vector3(-10, 20, 10),
      new THREE.Vector3(-10, 10, 10), new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(10, -10, 10), new THREE.Vector3(20, -15, 10),
      new THREE.Vector3(30, -15, 10), new THREE.Vector3(40, -15, 10),
      new THREE.Vector3(50, -15, 10), new THREE.Vector3(60, 0, 10),
      new THREE.Vector3(70, 0, 0), new THREE.Vector3(80, 0, 0),
      new THREE.Vector3(90, 0, 0), new THREE.Vector3(100, 0, 0)
    ]);

    this.sampleClosedSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -40, -40),
      new THREE.Vector3(0, 40, -40),
      new THREE.Vector3(0, 140, -40),
      new THREE.Vector3(0, 40, 40),
      new THREE.Vector3(0, -40, 40)
    ]);
    // @ts-ignore
    this.sampleClosedSpline.curveType = 'catmullrom';
    // @ts-ignore
    this.sampleClosedSpline.closed = true;

    this.splines = {
      GrannyKnot: new Curves.GrannyKnot(),
      HeartCurve: new Curves.HeartCurve(3.5),
      VivianiCurve: new Curves.VivianiCurve(70),
      KnotCurve: new Curves.KnotCurve(),
      HelixCurve: new Curves.HelixCurve(),
      TrefoilKnot: new Curves.TrefoilKnot(),
      TorusKnot: new Curves.TorusKnot(20),
      CinquefoilKnot: new Curves.CinquefoilKnot(20),
      TrefoilPolynomialKnot: new Curves.TrefoilPolynomialKnot(14),
      FigureEightPolynomialKnot: new Curves.FigureEightPolynomialKnot(),
      DecoratedTorusKnot4a: new Curves.DecoratedTorusKnot4a(),
      DecoratedTorusKnot4b: new Curves.DecoratedTorusKnot4b(),
      DecoratedTorusKnot5a: new Curves.DecoratedTorusKnot5a(),
      DecoratedTorusKnot5c: new Curves.DecoratedTorusKnot5c(),
      PipeSpline: this.pipeSpline,
      SampleClosedSpline: this.sampleClosedSpline
    };


    this.params = {
      spline: 'GrannyKnot',
      scale: 4,
      extrusionSegments: 100,
      radiusSegments: 3,
      closed: true,
      animationView: false,
      lookAhead: false,
      cameraHelper: false,
    };

    this.material = new THREE.MeshLambertMaterial({color: 0xFF0000});

    this.wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      opacity: 0.3,
      wireframe: true,
      transparent: true
    });
    this.renderer = new THREE.WebGLRenderer({antialias: true});
  }

  ngOnInit(): void {
    this.init();
    this.keyStrokes();
    this.animate();
  }

  keyStrokes() {
    const onKeyDown = (event) => {
      switch (event.code) {
        case 'KeyP':
          this.params.animationView = true;
          this.animateCamera();
          break;
        case 'KeyZ':
          this.params.animationView = false;
          this.animateCamera();
          break;
      }
    };
    document.addEventListener('keydown', onKeyDown);
  }

  addTube() {
    if (this.mesh !== undefined) {
      this.parent.remove(this.mesh);
      this.mesh.geometry.dispose();
    }
    const extrudePath = this.splines[this.params.spline];
    this.tubeGeometry = new THREE.TubeGeometry(extrudePath, this.params.extrusionSegments, 2, this.params.radiusSegments, this.params.closed);
    this.addGeometry(this.tubeGeometry);
    this.setScale();
  }

  setScale() {
    this.mesh.scale.set(this.params.scale, this.params.scale, this.params.scale);
  }

  addGeometry(geometry) {
    this.mesh = new THREE.Mesh(geometry, this.material);
    const wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);
    this.mesh.add(wireframe);
    this.parent.add(this.mesh);

  }

  animateCamera() {
    this.cameraHelper.visible = this.params.cameraHelper;
    this.cameraEye.visible = this.params.cameraHelper;
  }


  init() {
    this.container = document.getElementById('container');
    // camera

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10000);
    this.camera.position.set(0, 50, 500);

    // scene

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    // light

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    this.scene.add(light);

    // tube

    this.parent = new THREE.Object3D();
    this.scene.add(this.parent);

    this.splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000);
    this.parent.add(this.splineCamera);

    this.cameraHelper = new THREE.CameraHelper(this.splineCamera);
    this.scene.add(this.cameraHelper);

    this.addTube();

    // debug camera

    this.cameraEye = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
    this.parent.add(this.cameraEye);

    this.cameraHelper.visible = this.params.cameraHelper;
    this.cameraEye.visible = this.params.cameraHelper;

    // renderer

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    // stats


    // dat.GUI

    const gui = new GUI({width: 300});

    const folderGeometry = gui.addFolder('Geometry');
    folderGeometry.add(this.params, 'spline', Object.keys(this.splines)).onChange(() => {
      this.addTube();
    });
    folderGeometry.add(this.params, 'scale', 2, 10).step(2).onChange(() => {

      this.setScale();

    });
    folderGeometry.add(this.params, 'extrusionSegments', 50, 500).step(50).onChange(() => {

      this.addTube();

    });
    folderGeometry.add(this.params, 'radiusSegments', 2, 12).step(1).onChange(() => {

      this.addTube();

    });
    folderGeometry.add(this.params, 'closed').onChange(() => {

      this.addTube();

    });
    folderGeometry.open();

    const folderCamera = gui.addFolder('Camera');
    folderCamera.add(this.params, 'animationView').onChange(() => {

      this.animateCamera();

    });
    folderCamera.add(this.params, 'lookAhead').onChange(() => {

      this.animateCamera();

    });
    folderCamera.add(this.params, 'cameraHelper').onChange(() => {

      this.animateCamera();

    });
    folderCamera.open();

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.minDistance = 100;
    controls.maxDistance = 2000;
    window.addEventListener('resize', this.onWindowResize);
  }

  onWindowResize() {
    if (this.camera) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }
    if (this.renderer) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }


  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
  }

  render() {
    // animate camera along spline

    const time = Date.now();
    const looptime = 20 * 1000;
    const t = (time % looptime) / looptime;

    this.tubeGeometry.parameters.path.getPointAt(t, this.position);
    this.position.multiplyScalar(this.params.scale);

    // interpolation

    const segments = this.tubeGeometry.tangents.length;
    const pickt = t * segments;
    const pick = Math.floor(pickt);
    const pickNext = (pick + 1) % segments;

    this.binormal.subVectors(this.tubeGeometry.binormals[pickNext], this.tubeGeometry.binormals[pick]);
    this.binormal.multiplyScalar(pickt - pick).add(this.tubeGeometry.binormals[pick]);

    this.tubeGeometry.parameters.path.getTangentAt(t, this.direction);
    const offset = 15;

    this.normal.copy(this.binormal).cross(this.direction);

    // we move on a offset on its binormal

    this.position.add(this.normal.clone().multiplyScalar(offset));

    this.splineCamera.position.copy(this.position);
    this.cameraEye.position.copy(this.position);

    // using arclength for stablization in look ahead

    this.tubeGeometry.parameters.path.getPointAt((t + 30 / this.tubeGeometry.parameters.path.getLength()) % 1, this.lookAt);
    this.lookAt.multiplyScalar(this.params.scale);

    // camera orientation 2 - up orientation via normal

    if (!this.params.lookAhead) {
      this.lookAt.copy(this.position).add(this.direction);
    }
    this.splineCamera.matrix.lookAt(this.splineCamera.position, this.lookAt, this.normal);
    this.splineCamera.quaternion.setFromRotationMatrix(this.splineCamera.matrix);
    this.cameraHelper.update();
    this.renderer.render(this.scene, this.params.animationView === true ? this.splineCamera : this.camera);

  }

}
