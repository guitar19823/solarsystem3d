import * as THREE from "three";
import { CanvasName, PlatformAdapter } from "../adapters/platform-adapter";
import { ISceneManager } from "./interfaces";
import { ICameraController } from "./interfaces";
import { IObjectFactory } from "./interfaces";
import { MiniMap } from "./mini-map";
import { SolarSystem } from "../simulation/solar-system";
import { FPS } from "./fps";

export class RendererCore {
  private renderer: THREE.WebGLRenderer;

  constructor(
    private platformAdapter: PlatformAdapter,
    private sceneManager: ISceneManager,
    private cameraController: ICameraController,
    private objectFactory: IObjectFactory,
    private miniMap: MiniMap,
    private system: SolarSystem,
    private fps: FPS,
  ) {

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.platformAdapter.getCanvas(CanvasName.MAIN_SCENE),
      antialias: true,
    });

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Мягкие тени
    // Альтернативы:
    // THREE.PCFShadowMap (чётче)
    // THREE.BasicShadowMap (быстрее, грубее)
  }

  public init(): void {
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

    this.objectFactory.init();
    this.miniMap.init();
    this.fps.init();
  }

  public render(deltaTime: number): void {
    this.objectFactory.render(deltaTime);
    this.miniMap.render(this.system.getSpaceObjects());
    this.fps.render(deltaTime)

    this.renderer.render(
      this.sceneManager.getScene(),
      this.cameraController.getCamera()
    );
  }
}
