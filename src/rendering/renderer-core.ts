import * as THREE from "three";
import { CanvasName, PlatformAdapter } from "../adapters/platform-adapter";
import { SpaceObject } from "../entities/space-object";
import { SIMULATION_CONFIG } from "../config/simulation-config";
import { ISceneManager } from "./interfaces";
import { ICameraController } from "./interfaces";
import { IObjectFactory } from "./interfaces";
import { MiniMap } from "./mini-map";

export class RendererCore {
  private renderer: THREE.WebGLRenderer;
  private sceneManager: ISceneManager;
  private cameraController: ICameraController;
  private objectFactory: IObjectFactory;
  private spaceObjectMeshes: Map<string, THREE.Mesh> = new Map();
  private spaceObjectLabels: Map<string, THREE.Sprite> = new Map();
  private fpsElement: HTMLElement | null = null;
  private platformAdapter: PlatformAdapter;
  private miniMap: MiniMap;

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
      canvas: platformAdapter.getCanvas(CanvasName.MAIN_SCENE),
      antialias: true,
    });

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Мягкие тени
    // Альтернативы:
    // THREE.PCFShadowMap (чётче)
    // THREE.BasicShadowMap (быстрее, грубее)

    this.miniMap = new MiniMap(platformAdapter);
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

    this.platformAdapter.appendToDom(this.miniMap.getDOMElement());
  }

  setFpsElement(element: HTMLElement): void {
    this.fpsElement = element;
  }

  initSpaceObjects(spaceObjects: SpaceObject[]): void {
    const background = this.objectFactory.createSpaceBackground();

    this.sceneManager.getScene().add(background);

    spaceObjects.forEach((obj) => {
      if (obj.name === "Sun") {
        const mesh = this.objectFactory.createSunMaterial(obj);
        const glowMesh = this.objectFactory.createGlowMaterial(obj, mesh);

        this.spaceObjectMeshes.set(obj.name, mesh);
        this.spaceObjectMeshes.set("SunGlow", glowMesh);
        this.sceneManager.getScene().add(mesh);
        this.sceneManager.getScene().add(glowMesh);
      } else {
        const mesh = this.objectFactory.createSpaceObject(obj);

        this.spaceObjectMeshes.set(obj.name, mesh);
        this.sceneManager.getScene().add(mesh);
      }

      const labelSprite = this.objectFactory.createLabelSprite(
        obj.name,
        this.platformAdapter
      );

      if (labelSprite) {
        this.spaceObjectLabels.set(obj.name, labelSprite);
        this.sceneManager.getScene().add(labelSprite);
      }
    });

    const mesh = this.spaceObjectMeshes.get("Earth");

    if (mesh) {
      this.cameraController.smoothMoveTo(mesh.position, 2000);
    }
  }

  updateSpaceObjects(spaceObjects: SpaceObject[]): void {
    const scaleDist = SIMULATION_CONFIG.SCALE_DIST;

    spaceObjects.forEach((obj) => {
      const mesh = this.spaceObjectMeshes.get(obj.name);
      const label = this.spaceObjectLabels.get(obj.name);

      if (!mesh) {
        return;
      }

      mesh.position.set(
        obj.pos.x * scaleDist,
        obj.pos.y * scaleDist,
        obj.pos.z * scaleDist
      );

      if (label) {
        label.position.copy(mesh.position);
        label.position.y += obj.radius * scaleDist * 1.3;

        const distance = this.cameraController
          .getCamera()
          .position.distanceTo(label.position);

        label.scale.setScalar(distance / SIMULATION_CONFIG.LABEL_SCALE_FATOR);
      }
    });

    const glowMesh = this.spaceObjectMeshes.get("SunGlow");

    if (glowMesh) {
      glowMesh.lookAt(this.cameraController.getCamera().position);
    }

    this.miniMap.update(spaceObjects);
  }

  render(deltaTime: number): void {
    const sunMaterial = this.objectFactory.getSunMaterial();

    if (sunMaterial) {
      sunMaterial.uniforms.uTime.value += deltaTime * 0.001;
    }

    this.cameraController.update();

    if (this.fpsElement) {
      const fps = 1000 / deltaTime;
      this.fpsElement.textContent = `FPS: ${Math.floor(fps)}`;
    }

    this.renderer.render(
      this.sceneManager.getScene(),
      this.cameraController.getCamera()
    );

    this.miniMap.render();
  }

  dispose(): void {
    this.renderer.dispose();

    this.spaceObjectMeshes.forEach((mesh) => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });

    this.spaceObjectMeshes.clear();

    this.spaceObjectLabels.forEach((sprite) => {
      sprite.material.map?.dispose();
      sprite.material.dispose();
      this.sceneManager.getScene().remove(sprite);
    });

    this.spaceObjectLabels.clear();
  }
}
