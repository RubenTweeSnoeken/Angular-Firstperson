import { Component, OnInit } from '@angular/core';
import { CameraService } from 'src/app/services/camera/camera.service';
import { ControlService } from 'src/app/services/control/control.service';
import { LightService } from 'src/app/services/light/light.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { MeshService } from 'src/app/services/mesh/mesh.service';
import { RendererService } from 'src/app/services/renderer/renderer.service';
import { SceneService } from 'src/app/services/scene/scene.service';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";



@Component({
    selector: 'app-windmill',
    templateUrl: './windmill.component.html',
    styleUrls: ['./windmill.component.scss']
})
export class WindmillComponent implements OnInit {
    constructor(private rendererService: RendererService,
        private cameraService: CameraService,
        private sceneService: SceneService,
        private controlService: ControlService,
        private meshService: MeshService,
        private lightService: LightService,
        private loaderService: LoaderService) { }
    renderer: THREE.Renderer;
    scene: THREE.Scene;
    camera: any;

    ngOnInit(): void {
        this.drawObj();
    }



    drawObj() {
        const canvas: HTMLCanvasElement = document.querySelector('#c');
        this.renderer = this.rendererService.createRender('#c', window.innerWidth, window.innerHeight);
        this.camera = this.cameraService.createCamera(20, 5, 20, 45, 2, 0.1, 10000);
        const controls = this.controlService.createControls(this.camera, canvas, 0, 5, 0);
        this.scene = this.sceneService.createScene();
        this.sceneService.setBackgroundColor(this.scene, 'blue');
        let mesh = this.meshService.createMeshCustom();
        this.scene.add(mesh);
        const light = this.lightService.createHemisphereLight(0, 0, 0, 0xB1E1FF, 0xB97A20, 1);
        this.scene.add(light);
        const directLight = this.lightService.createDirectionalLight(0xFFFFFF, 5, 10, 10, 1)
        this.scene.add(directLight);
        this.loaderService.createLoader(this.scene);
        requestAnimationFrame(() => this.render());

    }

    resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        return needResize;
    }
    
    render() {
        if (this.resizeRendererToDisplaySize(this.renderer)) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.render());
    }

}


