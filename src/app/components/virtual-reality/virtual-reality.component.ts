import { Component, OnInit } from '@angular/core';
import { WebGLRenderer } from 'three';

import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory.js';

@Component({
  selector: 'app-virtual-reality',
  templateUrl: './virtual-reality.component.html',
  styleUrls: ['./virtual-reality.component.scss']
})
export class VirtualRealityComponent implements OnInit {
  container;
  camera;
  scene;
  renderer: WebGLRenderer;
  hand1;
  hand2;
  controller1;
  controller2;
  controllerGrip1;
  controllerGrip2;

  controls;

  constructor() { }

  ngOnInit(): void {
		this.init();
		this.animate();
  }

  init() {

    // Scene initialization

    this.container = document.createElement( 'div' );
    document.body.appendChild( this.container );

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x444444 );

    this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
    this.camera.position.set( 0, 1.6, 3 );

    this.controls = new OrbitControls( this.camera, this.container );
    this.controls.target.set( 0, 1.6, 0 );
    this.controls.update();

    const floorGeometry = new THREE.PlaneGeometry( 4, 4 );
    const floorMaterial = new THREE.MeshStandardMaterial( { color: 0x222222 } );
    const floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add( floor );

    this.scene.add( new THREE.HemisphereLight( 0x808080, 0x606060 ) );

    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 6, 0 );
    light.castShadow = true;
    light.shadow.camera.top = 2;
    light.shadow.camera.bottom = - 2;
    light.shadow.camera.right = 2;
    light.shadow.camera.left = - 2;
    light.shadow.mapSize.set( 4096, 4096 );
    this.scene.add( light );

    // Scene renderer init

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.xr.enabled = true;

    this.container.appendChild( this.renderer.domElement );

    document.body.appendChild( VRButton.createButton( this.renderer ) );

    // controllers

    this.controller1 = this.renderer.xr.getController( 0 );
    this.scene.add( this.controller1 );

    this.controller2 = this.renderer.xr.getController( 1 );
    this.scene.add( this.controller2 );

    const controllerModelFactory = new XRControllerModelFactory();
    const handModelFactory = new XRHandModelFactory();//.setPath( "./models/fbx/" );

    // Hand 1
    this.controllerGrip1 = this.renderer.xr.getControllerGrip( 0 );
    this.controllerGrip1.add( controllerModelFactory.createControllerModel( this.controllerGrip1 ) );
    this.scene.add( this.controllerGrip1 );

    this.hand1 = this.renderer.xr.getHand( 0 );
    this.hand1.add( handModelFactory.createHandModel( this.hand1 ) );

    this.scene.add( this.hand1 );

    // Hand 2
    this.controllerGrip2 = this.renderer.xr.getControllerGrip( 1 );
    this.controllerGrip2.add( controllerModelFactory.createControllerModel( this.controllerGrip2 ) );
    this.scene.add( this.controllerGrip2 );

    this.hand2 = this.renderer.xr.getHand( 1 );
    this.hand2.add( handModelFactory.createHandModel( this.hand2 ) );
    this.scene.add( this.hand2 );

    // Add pointing line to controllers

    const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

    const line = new THREE.Line( geometry );
    line.name = 'line';
    line.scale.z = 5;

    this.controller1.add( line.clone() );
    this.controller2.add( line.clone() );

    //

    window.addEventListener( 'resize', this.onWindowResize );

    // Audio
    // create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    this.camera.add( listener );

    // create a global audio source
    const sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'assets/sounds/Streets.mp3', function( buffer ) {
      sound.setBuffer( buffer );
      sound.setLoop( true );
      sound.setVolume( 0.5 );
      sound.play();
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  //

  animate() {
    this.renderer.setAnimationLoop( () => this.render() );
  }

  render() {
    this.renderer.render( this.scene, this.camera );
  }
}
