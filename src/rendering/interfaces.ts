import * as THREE from "three";
import { SpaceObject } from "../entities/space-object";
import { PlatformAdapter } from "../adapters/platform-adapter";

export interface ITextureManager {
  loadTexture(path: string): THREE.Texture;
}

export interface IObjectFactory {
  createSunMaterial(spaceObject: SpaceObject): THREE.Mesh;
  createGlowMaterial(spaceObject: SpaceObject, mesh: THREE.Mesh): THREE.Mesh;
  createSpaceObject(spaceObject: SpaceObject): THREE.Mesh;
  createSpaceBackground(): THREE.Mesh;
  createLabelSprite(
    text: string,
    platformAdapter: PlatformAdapter
  ): THREE.Sprite | undefined;
  getSunMaterial(): THREE.ShaderMaterial | undefined;
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
  reset(): void;
  setEnabled(enabled: boolean): void;
  getPosition(): THREE.Vector3;
  getDirection(): THREE.Vector3;
  smoothMoveTo(position: THREE.Vector3, duration?: number): void;
}
