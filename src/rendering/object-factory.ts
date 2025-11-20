import * as THREE from "three";
import { SpaceObject } from "../entities/space-object";
import { ICameraController, IObjectFactory, ISceneManager, ITextureManager } from "./interfaces";
import { SIMULATION_CONFIG } from "../config/simulation-config";
import { PlatformAdapter } from "../adapters/platform-adapter";
import { SunShader } from "../ shaders/sun-shader";
import { GlowShader } from "../ shaders/glow-shader";
import { SolarSystem } from "../simulation/solar-system";

export class ObjectFactory implements IObjectFactory {
  private spaceObjectMaterials: Map<string, THREE.ShaderMaterial> = new Map();
  private spaceObjectMeshes: Map<string, THREE.Mesh> = new Map();
  private spaceObjectLabels: Map<string, THREE.Sprite> = new Map();

  constructor(
    private platformAdapter: PlatformAdapter,
    private textureManager: ITextureManager,
    private sceneManager: ISceneManager,
    private cameraController: ICameraController,
    private system: SolarSystem,
  ) {}

  public init(): void {
    const background = this.createSpaceBackground();
    const spaceObjects = this.system.getSpaceObjects();

    this.sceneManager.getScene().add(background);

    spaceObjects.forEach((obj) => {
      if (obj.name === "Camera") {
        return;
      } else if (obj.name === "Sun") {
        const mesh = this.createSunMaterial(obj);
        const glowMesh = this.createGlowMaterial(obj, mesh);

        this.spaceObjectMeshes.set(obj.name, mesh);
        this.spaceObjectMeshes.set("SunGlow", glowMesh);
        this.sceneManager.getScene().add(mesh);
        this.sceneManager.getScene().add(glowMesh);
      } else {
        const mesh = this.createSpaceObject(obj);

        this.spaceObjectMeshes.set(obj.name, mesh);
        this.sceneManager.getScene().add(mesh);
      }

      const labelSprite = this.createLabelSprite(obj.name);

      if (labelSprite) {
        this.spaceObjectLabels.set(obj.name, labelSprite);
        this.sceneManager.getScene().add(labelSprite);
      }
    });
  }

  public render(deltaTime: number): void {
      const scaleDist = SIMULATION_CONFIG.SCALE_DIST;
      const spaceObjects = this.system.getSpaceObjects();
  
      spaceObjects.forEach((obj) => {
        if (obj.name === "Camera") {
          this.cameraController.setPosition(
            new THREE.Vector3(
              obj.pos.x * scaleDist,
              obj.pos.y * scaleDist,
              obj.pos.z * scaleDist
            )
          );
  
          return;
        }
  
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

      const sunMaterial = this.spaceObjectMaterials.get('Sun');

      if (sunMaterial) {
        sunMaterial.uniforms.uTime.value += deltaTime * 0.001;
      }
    }

  private createSunMaterial(spaceObject: SpaceObject) {
    const sunMaterial = new THREE.ShaderMaterial({
      uniforms: SunShader.uniforms,
      vertexShader: SunShader.vertexShader,
      fragmentShader: SunShader.fragmentShader,
      transparent: false,
    });

    sunMaterial.uniforms.uTexture.value = this.textureManager.loadTexture("sun_color.jpg");
    sunMaterial.uniforms.uNormalMap.value = this.textureManager.loadTexture("sun_normal.jpg");
    sunMaterial.uniforms.uEmissiveMap.value = this.textureManager.loadTexture("sun_emissive.jpg");

    this.spaceObjectMaterials.set(spaceObject.name, sunMaterial)

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

  private createGlowMaterial(spaceObject: SpaceObject, mesh: THREE.Mesh) {
    const glowRadius = this.calcRadiusPx(spaceObject.radius) * 5;
    const glowGeometry = new THREE.PlaneGeometry(glowRadius, glowRadius);

    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: GlowShader.uniforms,
      vertexShader: GlowShader.vertexShader,
      fragmentShader: GlowShader.fragmentShader,
      transparent: true,
      blending: THREE.NormalBlending,
      depthTest: false,
    });

    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);

    glowMesh.position.copy(mesh.position);
    glowMesh.castShadow = false;
    glowMesh.receiveShadow = false;

    return glowMesh;
  }

  private createSpaceObject(spaceObject: SpaceObject): THREE.Mesh {
    const material = this.getSpaceObjectMaterial(spaceObject);
    
    const geometry = new THREE.SphereGeometry(
      this.calcRadiusPx(spaceObject.radius),
      32,
      32,
    );

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = spaceObject.name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  private createSpaceBackground(): THREE.Mesh {
    const spaceGeometry = new THREE.SphereGeometry(500000, 100, 100);
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

  private createLabelSprite(
    text: string,
  ): THREE.Sprite | undefined {
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

  private getSpaceObjectMaterial(spaceObject: SpaceObject) {
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
}
