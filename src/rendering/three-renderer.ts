import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SpaceObject } from "../entities/space-object";
import { SIMULATION_CONFIG } from "../config/simulation-config";
import { PlatformAdapter } from "../types/platform-adapter";

export class ThreeRenderer {
  private platformAdapter: PlatformAdapter;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private spaceObjectMeshes: Map<string, THREE.Mesh> = new Map();
  private fpsElement: HTMLElement | null = null;
  private textureCache: Map<string, THREE.Texture> = new Map();
  private textureLoader: THREE.TextureLoader;

  constructor(platformAdapter: PlatformAdapter) {
    this.platformAdapter = platformAdapter;
    this.scene = new THREE.Scene();
    this.textureLoader = new THREE.TextureLoader();
    this.setupLighting();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(
      65,
      platformAdapter.getWidth() / platformAdapter.getHeight(),
      0.001,
      50000000000
    );

    this.camera.position.set(0, 0, 1000);

    const spaceGeometry = new THREE.SphereGeometry(500000, 30, 30);
    const spaceTexture = this.textureLoader.load(
      `/src/textures/spacemedium.jpg`
    );

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

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.platformAdapter.createCanvas(),
      antialias: true,
    });

    this.renderer.setPixelRatio(this.platformAdapter.getPixelRatio());

    this.renderer.setSize(
      this.platformAdapter.getWidth(),
      this.platformAdapter.getHeight()
    );

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 50;
    this.controls.maxDistance = 2000;
  }

  updateSpaceObjects(spaceObjects: SpaceObject[]): void {
    spaceObjects.forEach((spaceObject) => {
      const mesh = this.spaceObjectMeshes.get(spaceObject.name);

      if (!mesh) return;

      const scaleDist = SIMULATION_CONFIG.SCALE_DIST;

      mesh.position.set(
        spaceObject.pos.x * scaleDist,
        spaceObject.pos.y * scaleDist,
        spaceObject.pos.z * scaleDist
      );
    });
  }

  setFpsElement(element: HTMLElement) {
    this.fpsElement = element;
  }

  render(deltaTimeMs: number): void {
    if (this.fpsElement) {
      const fps = 1000 / deltaTimeMs;
      this.fpsElement.textContent = `FPS: ${Math.trunc(fps)}`;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  initSpaceObjects(spaceObjects: SpaceObject[]): void {
    spaceObjects.forEach((spaceObject) => {
      const mesh = this.createSpaceObjectMesh(spaceObject);
      this.scene.add(mesh);
    });
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private setupLighting() {
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 50000, 2);
    pointLight.position.set(0, 0, 0);
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    pointLight.shadow.camera.near = 0.001;
    pointLight.shadow.camera.far = 50000;
    pointLight.castShadow = true;
    this.scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(ambientLight);
  }

  private createSpaceObjectMesh(spaceObject: SpaceObject): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(
      spaceObject.radius *
        SIMULATION_CONFIG.SCALE_DIST *
        SIMULATION_CONFIG.OBJECTS_RADIUS_SCALE,
      32,
      32
    );

    let texture: THREE.Texture | null = null;

    if (spaceObject.texture) {
      texture = this.loadTexture(spaceObject.texture);
      texture.anisotropy = 7;
    }

    const material = new THREE.MeshPhongMaterial({
      specular: new THREE.Color(0x333333),
      ...(texture
        ? {
            map: texture,
            bumpMap: texture,
            bumpScale: 0.05,
            color: 0xffffff,
            shininess: 30,
          }
        : {
            bumpScale: 0,
            color: new THREE.Color(spaceObject.color),
            shininess: 5,
          }),
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = spaceObject.name;

    this.spaceObjectMeshes.set(spaceObject.name, mesh);

    return mesh;
  }

  private loadTexture(path: string): THREE.Texture {
    if (this.textureCache.has(path)) {
      return this.textureCache.get(path)!;
    }

    const texture = this.textureLoader.load(
      `src/textures/${path}`,
      () => {
        console.log(`Текстура загружена: ${path}`);
      },
      undefined,
      (error) => {
        console.error(`Ошибка загрузки текстуры: ${path}`, error);
      }
    );

    this.textureCache.set(path, texture);

    return texture;
  }
}
