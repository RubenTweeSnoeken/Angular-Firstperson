import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  mixer: THREE.AnimationMixer = null;
  clips: THREE.AnimationClip[];

  initMesh(mesh: any) {
    this.mixer = new THREE.AnimationMixer(mesh);
    this.clips = mesh.animations;
  }

  // Update the mixer on each frame
  update() {
    //this.mixer.update(deltaSeconds); // TODO: deltatime
  }

  // Play a specific animation
  playAnimation(clipName: string, loop: boolean) {
    const clip = THREE.AnimationClip.findByName(this.clips, clipName);
    let action = this.mixer.clipAction(clip);
    if (!loop)
      action.loop = THREE.LoopOnce;
    action.play();
  }

  cancelAnimFrame(frameId: number) {
    if (frameId != null) {
      cancelAnimationFrame(frameId);
    }
  }

  requestAnimFrame(frameId: number, render: void) {
    frameId = requestAnimationFrame(() => {
      console.log(render);
      render; // TODO:
    });
  }
}
