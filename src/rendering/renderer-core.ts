import * as THREE from "three";
import { PlatformAdapter } from "../adapters/platform-adapter";
import { SpaceObject } from "../entities/space-object";
import { SIMULATION_CONFIG } from "../config/simulation-config";
import { ISceneManager } from "./interfaces";
import { ICameraController } from "./interfaces";
import { IObjectFactory } from "./interfaces";

export class RendererCore {
  private renderer: THREE.WebGLRenderer;
  private sceneManager: ISceneManager;
  private cameraController: ICameraController;
  private objectFactory: IObjectFactory;
  private spaceObjectMeshes: Map<string, THREE.Mesh> = new Map();
  private fpsElement: HTMLElement | null = null;
  private platformAdapter: PlatformAdapter;

  constructor(
    platformAdapter: PlatformAdapter,
    sceneManager: ISceneManager,
    cameraController: ICameraController,
    objectFactory: IObjectFactory
  ) {
    this.platformAdapter = platformAdapter;
    this.sceneManager = sceneManager;
    this.cameraController = cameraController;
    this.objectFactory = objectFactory;

    this.renderer = new THREE.WebGLRenderer({
      canvas: platformAdapter.getCanvas(),
      antialias: true,
    });
  }

  initialize(): void {
    this.renderer.setPixelRatio(this.platformAdapter.getPixelRatio());

    this.platformAdapter.onResize(() => {
      const width = this.platformAdapter.getWidth();
      const height = this.platformAdapter.getHeight();
      this.renderer.setSize(width, height);
      this.cameraController.resize(width, height);
    });

    this.renderer.setSize(
      this.platformAdapter.getWidth(),
      this.platformAdapter.getHeight()
    );
  }

  setFpsElement(element: HTMLElement): void {
    this.fpsElement = element;
  }

  initSpaceObjects(spaceObjects: SpaceObject[]): void {
    spaceObjects.forEach((obj) => {
      const mesh = this.objectFactory.createSpaceObject(obj);
      this.spaceObjectMeshes.set(obj.name, mesh);
      this.sceneManager.getScene().add(mesh);
    });
  }

  updateSpaceObjects(spaceObjects: SpaceObject[]): void {
    const scaleDist = SIMULATION_CONFIG.SCALE_DIST;

    spaceObjects.forEach((obj) => {
      const mesh = this.spaceObjectMeshes.get(obj.name);

      if (mesh) {
        mesh.position.set(
          obj.pos.x * scaleDist,
          obj.pos.y * scaleDist,
          obj.pos.z * scaleDist
        );
      }
    });
  }

  render(deltaTime: number): void {
    this.cameraController.update();

    if (this.fpsElement) {
      const fps = 1000 / deltaTime;
      this.fpsElement.textContent = `FPS: ${Math.floor(fps)}`;
    }

    this.renderer.render(
      this.sceneManager.getScene(),
      this.cameraController.getCamera()
    );
  }

  dispose(): void {
    this.renderer.dispose();

    this.spaceObjectMeshes.forEach((mesh) => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });

    this.spaceObjectMeshes.clear();
  }
}
