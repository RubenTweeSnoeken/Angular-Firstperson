// @ts-nocheck
import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


@Component({
  selector: 'app-test-file',
  templateUrl: './test-file.component.html',
  styleUrls: ['./test-file.component.scss']
})
export class TestFileComponent implements OnInit {

  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
  controls: OrbitControls;
  plane: THREE.GridHelper;
  light1: THREE.Light;
  light2: THREE.Light;
  points: [];
  scale: number;
  percentage: number;
  prevTime: number;
  tube: THREE.Mesh;
  geometry: THREE.TubeGeometry;
  curvePath: THREE.CatmullRomCurve3;
  radius: number;

  constructor() {

  }

  init() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xd8e7ff, 0);
    document.body.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    });

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 10000);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;
    this.controls.maxPolarAngle = Math.PI / 2.1;

    this.plane = new THREE.GridHelper(10, 10);
    this.plane.material.color = new THREE.Color('red');
    this.scene.add(this.plane);

    this.light1 = new THREE.DirectionalLight(0xefefff, 1.5);
    this.light1.position.set(1, 1, 1).normalize();
    this.scene.add(this.light1);

    this.light2 = new THREE.DirectionalLight(0xffefef, 1.5);
    this.light2.position.set(-1, -1, -1).normalize();
    this.scene.add(this.light2);

    this.points = [
      [-1.5, 0.0, 0.0],
      [-1.0, 1.0, 0.0],
      [1.0, 1.0, 0.0],
      [1.5, 0.0, 0.0],
      [1.2775949239730835, -0.8299283981323242, -0.26480546593666077],
      [0.6446040868759155, -1.443454623222351, 0.40014150738716125],
      [0.45479920506477356, -1.0621963739395142, 1.0581027269363403],
      [0.8405577540397644, -0.10755002498626709, 1.124037742614746],
    ];

    this.scale = 5;

    for (let i = 0; i < this.points.length; i++) {
      const x = this.points[i][0] * this.scale;
      const y = this.points[i][1] * this.scale;
      const z = this.points[i][2] * this.scale;
      this.points[i] = new THREE.Vector3(x, z, -y);
    }

    this.percentage = 0;
    this.prevTime = Date.now();

    this.curvePath = new THREE.CubicBezierCurve3(new THREE.Vector3(389.76843686945404, 552.51481137238443, 156.10018915737797),
      new THREE.Vector3(-153.56300074753207, 271.49711742836848, -114.495472686253045),
      new THREE.Vector3(-191.40118730204415, 276.4306956436485, -106.958271935582161),
      new THREE.Vector3(-483.785318791128, 591.1365363371675, 147.869296953772746));
    this.radius = .25;

    this.geometry = new THREE.TubeGeometry(this.curvePath, 50, this.radius, 10, false);


    const material = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      vertexColors: THREE.FaceColors,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1
    });
    this.tube = new THREE.Mesh(this.geometry, material);
    this.scene.add(this.tube);

    this.camera.position.x = 0;
    this.camera.position.y = 5;
    this.camera.position.z = -15;

  }

  ngOnInit(): void {
    this.init();
    this.animate();
  }

  moveCamera() {
    this.percentage += 0.00095;
    const p1 = this.curvePath.getPointAt(this.percentage % 1);
    const p2 = this.curvePath.getPointAt((this.percentage + 0.01) % 1);

    this.camera.position.x = p1.x;
    this.camera.position.y = p1.y + 1.75;
    this.camera.position.z = p1.z;
    this.camera.lookAt(p2.x, p2.y + 1.5, p2.z);
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.moveCamera();
  }
}
