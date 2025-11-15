import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Planet } from "../entities/planet";
import { SIMULATION_CONFIG } from "../config/simulation-config";

export class ThreeRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private planetMeshes: Map<string, THREE.Mesh> = new Map();
  private fpsElement: HTMLElement | null = null;

  constructor(canvas: HTMLCanvasElement) {
    // Инициализация сцены
    this.scene = new THREE.Scene();
    this.setupLighting();
    this.scene.background = new THREE.Color(0x000000);

    // Камера
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );

    this.camera.position.set(0, 0, 1000);

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
    const ambientLight = new THREE.AmbientLight(0xaaaaaa, 1);
    this.scene.add(ambientLight);

    // Дополнительный точечный свет (для объёма)
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 0);
    this.scene.add(pointLight);
  }

  private createPlanetMesh(planet: Planet): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(
      planet.radius *
        SIMULATION_CONFIG.SCALE_DIST *
        SIMULATION_CONFIG.PLANET_RADIUS_SCALE,
      32,
      32
    );

    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(planet.color),
      shininess: 50,
      specular: 0x333333,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = planet.name;

    this.planetMeshes.set(planet.name, mesh);

    return mesh;
  }
}
