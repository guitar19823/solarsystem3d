import * as THREE from "three";
import {
  ICameraController,
  IObjectFactory,
  ISceneManager,
  ITextureManager,
} from "./interfaces";
import { SIMULATION_CONFIG } from "../config/simulation-config";
import { PlatformAdapter } from "../adapters/platform-adapter";
import { SunShader } from "../ shaders/sun-shader";
import { GlowShader } from "../ shaders/glow-shader";
import { SolarSystem } from "../simulation/solar-system";
import { CelestialBody } from "../entities/celestial-body";

export class ObjectFactory implements IObjectFactory {
  private spaceObjectMaterials: Map<string, THREE.ShaderMaterial> = new Map();
  private spaceObjectMeshes: Map<string, THREE.Mesh> = new Map();
  private spaceObjectGroups: Map<string, THREE.Group> = new Map();
  private spaceObjectLabels: Map<string, THREE.Sprite> = new Map();
  private rotationAccumulators: Map<string, number> = new Map();

  constructor(
    private platformAdapter: PlatformAdapter,
    private textureManager: ITextureManager,
    private sceneManager: ISceneManager,
    private cameraController: ICameraController,
    private system: SolarSystem
  ) {}

  public init(): void {
    this.sceneManager.getScene().add(this.createSpaceBackground());
    this.initObjects(this.system.getSolarSystem());
  }

  public render(deltaTime: number): void {
    this.updateObjects(this.system.getSolarSystem(), deltaTime);
    this.updateSunShader();
  }

  private initObjects(spaceObject: CelestialBody) {
    if (!spaceObject.children) return;

    spaceObject.children.forEach((obj) => {
      if (obj.children) {
        this.initObjects(obj);

        return;
      }

      if (obj.name === "Camera") return;

      let mesh: THREE.Mesh;

      if (obj.name === "Sun") {
        mesh = this.createSunMaterial(obj);
        const glowMesh = this.createGlowMaterial(obj, mesh);

        this.spaceObjectMeshes.set("SunGlow", glowMesh);
        this.sceneManager.getScene().add(mesh);
        this.sceneManager.getScene().add(glowMesh);
      } else {
        mesh = this.createSpaceObject(obj);

        this.sceneManager.getScene().add(mesh);
      }

      this.spaceObjectMeshes.set(obj.name, mesh);

      const labelSprite = this.createLabelSprite(obj.name);

      // Создаём Group для трансформаций (даже если вращение не нужно)
      const group = new THREE.Group();
      group.add(mesh); // Mesh становится дочерним
      this.sceneManager.getScene().add(group);
      this.spaceObjectGroups.set(obj.name, group); // Сохраняем Group

      if (labelSprite) {
        this.spaceObjectLabels.set(obj.name, labelSprite);
        this.sceneManager.getScene().add(labelSprite);
      }

      if (obj.rotationPeriod) {
        this.rotationAccumulators.set(obj.name, 0);
      }
    });
  }

  private updateObjects(spaceObject: CelestialBody, deltaTime: number) {
    if (!spaceObject.children) return;

    const scaleDist = SIMULATION_CONFIG.SCALE_DIST;

    spaceObject.children.forEach((obj) => {
      obj.pos.add(spaceObject.pos);

      if (obj.children) {
        this.updateObjects(obj, deltaTime);
      }

      const x = obj.pos.x + spaceObject.pos.x;
      const y = obj.pos.y + spaceObject.pos.y;
      const z = obj.pos.z + spaceObject.pos.z;

      if (obj.name === "Camera") {
        this.cameraController.setPosition(
          new THREE.Vector3(x, y, z).multiplyScalar(scaleDist)
        );

        return;
      }

      const mesh = this.spaceObjectMeshes.get(obj.name);
      const group = this.spaceObjectGroups.get(obj.name);
      const label = this.spaceObjectLabels.get(obj.name);

      if (!mesh || !group) return;

      // 1. Обновляем позицию Group (а не Mesh!)
      group.position.set(x, y, z).multiplyScalar(scaleDist);

      // 2. Применяем вращение к Group
      this.applyRotation(obj, group, mesh, deltaTime);

      // 3. Обновляем лейбл
      if (label) {
        this.updateLabelPosition(label, group, obj.radius, scaleDist);
      }

      // 4. Обновляем Glow для Солнца
      if (obj.name === "Sun") {
        this.updateSunGlow(mesh);
      }
    });
  }

  private createSunMaterial(spaceObject: CelestialBody) {
    const sunMaterial = new THREE.ShaderMaterial({
      uniforms: SunShader.uniforms,
      vertexShader: SunShader.vertexShader,
      fragmentShader: SunShader.fragmentShader,
      transparent: false,
    });

    sunMaterial.uniforms.uTexture.value =
      this.textureManager.loadTexture("sun_color.jpg");
    sunMaterial.uniforms.uNormalMap.value =
      this.textureManager.loadTexture("sun_normal.jpg");
    sunMaterial.uniforms.uEmissiveMap.value =
      this.textureManager.loadTexture("sun_emissive.jpg");

    this.spaceObjectMaterials.set(spaceObject.name, sunMaterial);

    const sunGeometry = new THREE.SphereGeometry(
      this.calcRadiusPx(spaceObject.radius),
      32,
      32
    );

    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);

    sunMesh.name = spaceObject.name;
    sunMesh.castShadow = false;
    sunMesh.receiveShadow = false;

    return sunMesh;
  }

  private createGlowMaterial(spaceObject: CelestialBody, mesh: THREE.Mesh) {
    const glowRadius = this.calcRadiusPx(spaceObject.radius) * 7;
    const glowGeometry = new THREE.PlaneGeometry(glowRadius, glowRadius);

    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: GlowShader.uniforms,
      vertexShader: GlowShader.vertexShader,
      fragmentShader: GlowShader.fragmentShader,
      transparent: true,
      blending: THREE.NormalBlending,
      depthTest: true,
      depthWrite: false,
    });

    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);

    glowMesh.position.copy(mesh.position);
    glowMesh.castShadow = false;
    glowMesh.receiveShadow = false;

    return glowMesh;
  }

  private createSpaceObject(spaceObject: CelestialBody): THREE.Mesh {
    const material = this.getSpaceObjectMaterial(spaceObject);

    const geometry = new THREE.SphereGeometry(
      this.calcRadiusPx(spaceObject.radius),
      32,
      32
    );

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = spaceObject.name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  private createSpaceBackground(): THREE.Mesh {
    const spaceGeometry = new THREE.SphereGeometry(50000000, 100, 100);
    const spaceTexture = this.textureManager.loadTexture("spacehigh.jpg");
    spaceTexture.anisotropy = 10;

    const spaceMaterial = new THREE.MeshBasicMaterial({
      map: spaceTexture,
      side: THREE.BackSide,
    });

    const background = new THREE.Mesh(spaceGeometry, spaceMaterial);
    background.scale.x = -1;
    background.scale.y = -1;
    background.scale.z = -1;
    background.rotation.x = -Math.PI * 0.37;
    background.rotation.y = -Math.PI * 0.88;
    background.rotation.z = Math.PI * 0.58;

    return background;
  }

  private createLabelSprite(text: string): THREE.Sprite | undefined {
    const canvas = this.platformAdapter.getCanvasWithoutAddToDom();

    if (!canvas) return;

    const context = canvas.getContext("2d")!;
    context.font = "24px Arial, sans-serif";
    context.textAlign = "center";

    context.fillStyle = "white";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
    });

    return new THREE.Sprite(material);
  }

  private getSpaceObjectMaterial(spaceObject: CelestialBody) {
    if (spaceObject.texture) {
      const texture = this.textureManager.loadTexture(spaceObject.texture);

      return new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.05,
        color: 0xffffff,
        shininess: 30,
        specular: new THREE.Color(0x333333),
      });
    }

    return new THREE.MeshPhongMaterial({
      color: new THREE.Color(spaceObject.color),
      shininess: 5,
      specular: new THREE.Color(0x333333),
    });
  }

  private calcRadiusPx(radius: number) {
    return (
      radius *
      SIMULATION_CONFIG.SCALE_DIST *
      SIMULATION_CONFIG.OBJECTS_RADIUS_SCALE
    );
  }

  private applyRotation(
    obj: CelestialBody,
    group: THREE.Group,
    mesh: THREE.Mesh, // явно указываем тип
    deltaTime: number
  ): void {
    if (!obj.rotationPeriod) return;

    const periodSec = obj.rotationPeriod * 24 * 3600;
    const angularSpeed = (2 * Math.PI) / periodSec;
    const accumulator = this.rotationAccumulators.get(obj.name) || 0;

    const scaledDeltaTime =
      (deltaTime / 1000) * SIMULATION_CONFIG.SIMULATION_DT;
    const newAccumulator = accumulator + angularSpeed * scaledDeltaTime;
    this.rotationAccumulators.set(obj.name, newAccumulator);

    // Получаем equatorGroup (дочернюю группу для вращения)
    let equatorGroup = group.children.find(
      (child) => (child as any).userData?.isEquatorGroup
    ) as THREE.Group | undefined;

    if (!equatorGroup) {
      equatorGroup = new THREE.Group();
      equatorGroup.userData.isEquatorGroup = true;

      // Перемещаем mesh в equatorGroup
      mesh.parent?.remove(mesh);
      equatorGroup.add(mesh);
      group.add(equatorGroup);
    }

    // Наклоняем ось (через group)
    if (obj.axialTilt !== undefined) {
      group.rotation.x = THREE.MathUtils.degToRad(obj.axialTilt);
    } else {
      group.rotation.x = 0;
    }

    // Вращаем equatorGroup вокруг локальной y
    equatorGroup.rotation.y = newAccumulator;
  }

  private updateLabelPosition(
    label: THREE.Sprite,
    mesh: THREE.Group | THREE.Mesh,
    radius: number,
    scaleDist: number
  ): void {
    label.position.copy(mesh.position);
    label.position.y += radius * scaleDist * 1.3;

    const distance = this.cameraController
      .getCamera()
      .position.distanceTo(label.position);
    label.scale.setScalar(distance / SIMULATION_CONFIG.LABEL_SCALE_FATOR);
  }

  private updateSunGlow(mesh: THREE.Group | THREE.Mesh): void {
    const glowMesh = this.spaceObjectMeshes.get("SunGlow");
    if (glowMesh) {
      glowMesh.position.copy(mesh.position);
      glowMesh.lookAt(this.cameraController.getCamera().position);
    }
  }

  private updateSunShader(): void {
    const sunMaterial = this.spaceObjectMaterials.get("Sun");
    if (sunMaterial) {
      sunMaterial.uniforms.uTime.value += 0.001;
    }
  }
}
