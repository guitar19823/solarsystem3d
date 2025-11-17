import * as THREE from "three";
import { ISceneManager } from "./interfaces";
import { TextureManager } from "./texture-manager";

export class SceneManager implements ISceneManager {
  private scene: THREE.Scene;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.setupLighting();
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  setupLighting(): void {
    const pointLight = new THREE.PointLight(0xffffff, 1.5);

    pointLight.position.set(0, 0, 0);
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 500000;
    pointLight.shadow.bias = 0.0001;
    pointLight.shadow.radius = 1;
    this.scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

    this.scene.add(ambientLight);
  }
}
