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
    this.addSpaceBackground();
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

  addSpaceBackground(): void {
    const spaceGeometry = new THREE.SphereGeometry(500000, 30, 30);
    const spaceTexture = this.textureLoader.loadTexture("spacehigh.jpg");
    spaceTexture.anisotropy = 10;

    const spaceMaterial = new THREE.MeshBasicMaterial({
      map: spaceTexture,
      side: THREE.BackSide,
    });

    const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
    space.scale.x = -1;
    space.scale.y = -1;
    space.scale.z = -1;
    space.rotation.x = -Math.PI * 0.37;
    space.rotation.y = -Math.PI * 0.88;
    space.rotation.z = Math.PI * 0.58;

    this.scene.add(space);
  }
}
