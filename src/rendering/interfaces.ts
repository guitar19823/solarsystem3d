import * as THREE from "three";
import { SpaceObject } from "../entities/space-object";
import { PlatformAdapter } from "../adapters/platform-adapter";

export interface ITextureManager {
  loadTexture(path: string): THREE.Texture;
}

export interface IObjectFactory {
  init(): void;
  render(deltaTime: number): void;
}

export interface ISceneManager {
  getScene(): THREE.Scene;
  setupLighting(): void;
}

export interface ICameraController {
  update(): void;
  resize(width: number, height: number): void;
  getCamera(): THREE.PerspectiveCamera;
  lookAt(target: THREE.Vector3): void;
  setPosition(position: THREE.Vector3): void;
  getPosition(): THREE.Vector3;
  getDirection(): THREE.Vector3;
}
