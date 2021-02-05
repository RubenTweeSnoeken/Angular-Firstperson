import { Injectable } from '@angular/core';
import { AmbientLight, AmbientLightProbe, DirectionalLight, Light, HemisphereLight, Color } from 'three';

@Injectable({
  providedIn: 'root'
})
export class LightService {
  light: Light = null;
  constructor() { }

  createAmbientLight(color: number | string, x: number, y: number, z: number, intensity: number) {
    this.light = new AmbientLight(color, intensity);
    this.light.position.z = z;
    this.light.position.y = y;
    this.light.position.x = x;
    return this.light;
  }


  createAmbientLightProbe(color: number | string, x: number, y: number, z: number, intensity: number) {
    this.light = new AmbientLightProbe(color, intensity);
    this.light.position.z = z;
    this.light.position.y = y;
    this.light.position.x = x;
    return this.light;
  }

  createDirectionalLight(color: number | string, x: number, y: number, z: number, intensity: number) {
    this.light = new DirectionalLight(color, intensity);
    this.light.position.z = z;
    this.light.position.y = y;
    this.light.position.x = x;
    return this.light;
  }

  createHemisphereLight(x: number, y: number, z: number, skyColor?: Color | string | number,
    groundColor?: Color | string | number,
    intensity?: number) {
    this.light = new HemisphereLight(skyColor, groundColor, intensity);
    this.light.position.z = z;
    this.light.position.y = y;
    this.light.position.x = x;
    return this.light;
  }

}
