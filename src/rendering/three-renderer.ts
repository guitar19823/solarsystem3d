import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Planet } from "../entities/planet";
import { SIMULATION_CONFIG } from "../config/simulation-config";
import { PlatformAdapter } from "../types/platform-adapter";

export class ThreeRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private planetMeshes: Map<string, THREE.Mesh> = new Map();
  private fpsElement: HTMLElement | null = null;
  private textureCache: Map<string, THREE.Texture> = new Map();
  private textureLoader: THREE.TextureLoader;

  constructor(canvas: HTMLCanvasElement, platformAdapter: PlatformAdapter) {
    // Инициализация сцены
    this.scene = new THREE.Scene();
    this.textureLoader = new THREE.TextureLoader();
    this.setupLighting();
    this.scene.background = new THREE.Color(0x000000);

    // Камера
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

    // Рендерер
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Управление камерой
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 50;
    this.controls.maxDistance = 2000;
  }

  updatePlanets(planets: Planet[]): void {
    planets.forEach((planet) => {
      const mesh = this.planetMeshes.get(planet.name);

      if (!mesh) return;

      const scaleDist = SIMULATION_CONFIG.SCALE_DIST;

      mesh.position.set(
        planet.pos.x * scaleDist,
        planet.pos.y * scaleDist,
        planet.pos.z * scaleDist
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

  initPlanets(planets: Planet[]): void {
    planets.forEach((planet) => {
      const mesh = this.createPlanetMesh(planet);
      this.scene.add(mesh);
    });
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private setupLighting() {
    // Окружающее освещение (рассеянное)
    // const ambientLight = new THREE.AmbientLight(0x050505, 0.2);

    // Дополнительный точечный свет (для объёма)
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

  private createPlanetMesh(planet: Planet): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(
      planet.radius *
        SIMULATION_CONFIG.SCALE_DIST *
        SIMULATION_CONFIG.PLANET_RADIUS_SCALE,
      32,
      32
    );

    let texture: THREE.Texture | null = null;

    if (planet.texture) {
      texture = this.loadTexture(planet.texture);
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
            color: new THREE.Color(planet.color),
            shininess: 5,
          }),
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = planet.name;

    this.planetMeshes.set(planet.name, mesh);

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
