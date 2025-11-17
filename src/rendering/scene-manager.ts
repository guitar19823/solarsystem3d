import * as THREE from "three";
import { ISceneManager } from "./interfaces";
import { TextureManager } from "./texture-manager";

export class SceneManager implements ISceneManager {
  private scene: THREE.Scene;
  private textureLoader: TextureManager;

  constructor() {
    this.scene = new THREE.Scene();
    this.textureLoader = new TextureManager();
    this.scene.background = new THREE.Color(0x000000);

    this.setupLighting();
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  setupLighting(): void {
    const pointLight = new THREE.PointLight(0xffffff, 1.5);

    pointLight.position.set(0, 0, 0);
    this.scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    this.scene.add(ambientLight);
  }
}
