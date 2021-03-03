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

  constructor() {
  }

  ngOnInit(): void {

//===================================================== add canvas
    var renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xd8e7ff, 0);
    document.body.appendChild(renderer.domElement);
//===================================================== resize
    window.addEventListener('resize', function() {
      var width = window.innerWidth;
      var height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
//===================================================== add Scene
    var scene = new THREE.Scene();
//===================================================== add Camera
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 10000);
//===================================================== add Controls
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.maxPolarAngle = Math.PI / 2.1;
//===================================================== add Grid
    var plane = new THREE.GridHelper(10, 10);
    plane.material.color = new THREE.Color('white');
    scene.add(plane);
//===================================================== add light
    var light1 = new THREE.DirectionalLight(0xefefff, 1.5);
    light1.position.set(1, 1, 1).normalize();
    scene.add(light1);

    var light2 = new THREE.DirectionalLight(0xffefef, 1.5);
    light2.position.set(-1, -1, -1).normalize();
    scene.add(light2);
//===================================================== curve points exported from blender using python
    var points = [

      [-1.5, 0.0, 0.0],
      [-1.0, 1.0, 0.0],
      [1.0, 1.0, 0.0],
      [1.5, 0.0, 0.0],
      [1.2775949239730835, -0.8299283981323242, -0.26480546593666077],
      [0.6446040868759155, -1.443454623222351, 0.40014150738716125],
      [0.45479920506477356, -1.0621963739395142, 1.0581027269363403],
      [0.8405577540397644, -0.10755002498626709, 1.124037742614746],

    ];

//===================================================== scale the curve to make it as large as you want
    var scale = 5;

//===================================================== Convert the array of points into vertices (in Blender the z axis is UP so we swap the z and y)
    for (var i = 0; i < points.length; i++) {
      var x = points[i][0] * scale;
      var y = points[i][1] * scale;
      var z = points[i][2] * scale;
      points[i] = new THREE.Vector3(x, z, -y);
    }

//===================================================== Create a path from the points
    var curvePath = new THREE.CatmullRomCurve3(points);
    var radius = .25;

//=====================================================  Create a tube geometry that represents our curve
    var geometry = new THREE.TubeGeometry(curvePath, 50, radius, 10, false);

//=====================================================  random face color for the tube.
//     console.log(geometry);
//     for (var i = 0, j = geometry.normals.length; i < j; i++) {
//       geometry.faces[i].color = new THREE.Color('hsl(' + Math.floor(Math.random() * 290) + ',50%,50%)');
//     }

    var material = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      vertexColors: THREE.FaceColors,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1
    });
    var tube = new THREE.Mesh(geometry, material);
    scene.add(tube);
//===================================================== Animate cmaera on the curve
    var percentage = 0;
    var prevTime = Date.now();

    function MoveCamera() {
      percentage += 0.00095;
      var p1 = curvePath.getPointAt(percentage % 1);
      var p2 = curvePath.getPointAt((percentage + 0.01) % 1);

      camera.position.x = p1.x;
      camera.position.y = p1.y + 1.75;
      camera.position.z = p1.z;
      camera.lookAt(p2.x, p2.y + 1.5, p2.z);
    }

//===================================================== Animate
    function animate() {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
      controls.update();
      MoveCamera();
    }

    animate();


//===================================================== set camera position
    camera.position.x = 0;
    camera.position.y = 5;
    camera.position.z = -15;


  }
}
