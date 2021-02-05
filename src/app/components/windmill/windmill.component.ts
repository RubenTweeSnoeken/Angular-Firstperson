import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
@Component({
    selector: 'app-windmill',
    templateUrl: './windmill.component.html',
    styleUrls: ['./windmill.component.scss']
})
export class WindmillComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }
    moveForward = false;
    moveBackward = false;
    moveLeft = false;
    moveRight = false;
    canJump = false;
    keypress = false;
    prevTime = performance.now();
    camera; scene; renderer; controls; raycaster;
    objects = [];
    velocity = new THREE.Vector3();
    direction = new THREE.Vector3();


    animate() {

        requestAnimationFrame(this.animate);

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

            if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 1000.0 * delta;
            if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 1000.0 * delta;

            if (onObject === true) {

                this.velocity.y = Math.max(0, this.velocity.y);
                this.canJump = true;

            }

            this.controls.moveRight(- this.velocity.x * delta);
            this.controls.moveForward(- this.velocity.z * delta);

            // controls.getObject().position.y += (velocity.y * delta); // new behavior

            if (this.controls.getObject().position.y < 10) {
                this.velocity.y = 0;
                this.controls.getObject().position.y = 3;
                this.canJump = true;
            }
        }
        this.prevTime = time;
        this.renderer.render(this.scene, this.camera);
    }

    controler(camera, scene) {
        this.controls = new PointerLockControls(camera, document.body);
        scene.add(this.controls.getObject());
    }

    keyStrokes() {
        const onKeyDown = function (event) {

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

        const onKeyUp = function (event) {

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

    drawObj() {
        const canvas = document.querySelector('#c');
        this.renderer //= new THREE.WebGLRenderer({ canvas, antialias: true });
        this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

        const fov = 45;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 0, 20);


        // this.controls = new OrbitControls(this.camera, canvas);
        // this.controls.target.set(0, 5, 0);
        // this.controls.update();

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('blue');

        {
            const planeSize = 40;

            const loader = new THREE.TextureLoader();
            const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.magFilter = THREE.NearestFilter;
            const repeats = planeSize / 2;
            texture.repeat.set(repeats, repeats);

            const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
            const planeMat = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide,
            });
            const mesh = new THREE.Mesh(planeGeo, planeMat);
            mesh.rotation.x = Math.PI * -.5;
            this.scene.add(mesh);
        }

        {
            const skyColor = 0xB1E1FF;  // light blue
            const groundColor = 0xB97A20;  // brownish orange
            const intensity = 1;
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
            this.scene.add(light);
        }

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(5, 10, 2);
            this.scene.add(light);
            this.scene.add(light.target);
        }

        {
            const mtlLoader = new MTLLoader();
            mtlLoader.load('https://threejsfundamentals.org/threejs/resources/models/windmill/windmill.mtl', (mtl) => {
                mtl.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(mtl);
                objLoader.load('https://threejsfundamentals.org/threejs/resources/models/windmill/windmill.obj', (root) => {
                    this.scene.add(root);
                });
            });
        }

        function resizeRendererToDisplaySize(renderer) {
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            return needResize;
        }

        function render() {

            if (resizeRendererToDisplaySize(this.renderer)) {
                const canvas = this.renderer.domElement;
                this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
                this.camera.updateProjectionMatrix();
            }

            this.renderer.render(this.scene, this.camera);

            requestAnimationFrame(render);
        }
        this.controler(this.camera, this.scene);
        this.keyStrokes();
        requestAnimationFrame(render);
    }

    

}
