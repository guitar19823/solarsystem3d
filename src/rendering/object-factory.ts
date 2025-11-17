import * as THREE from "three";
import { SpaceObject } from "../entities/space-object";
import { IObjectFactory, ITextureManager } from "./interfaces";
import { SIMULATION_CONFIG } from "../config/simulation-config";
import { PlatformAdapter } from "../adapters/platform-adapter";
import { SunShader } from "../ shaders/sun-shader";
import { GlowShader } from "../ shaders/glow-shader";

export class ObjectFactory implements IObjectFactory {
  private textureManager: ITextureManager;
  private sunMaterial: THREE.ShaderMaterial | undefined;

  constructor(textureManager: ITextureManager) {
    this.textureManager = textureManager;
  }

  createSunMaterial(spaceObject: SpaceObject) {
    this.sunMaterial = new THREE.ShaderMaterial({
      uniforms: SunShader.uniforms,
      vertexShader: SunShader.vertexShader,
      fragmentShader: SunShader.fragmentShader,
      transparent: false,
    });

    this.sunMaterial.uniforms.uTexture.value =
      this.textureManager.loadTexture("sun_color.jpg");

    this.sunMaterial.uniforms.uNormalMap.value =
      this.textureManager.loadTexture("sun_normal.jpg");

    this.sunMaterial.uniforms.uEmissiveMap.value =
      this.textureManager.loadTexture("sun_emissive.jpg");

    const sunGeometry = new THREE.SphereGeometry(
      this.calcRadiusPx(spaceObject.radius),
      32,
      32
    );

    const sunMesh = new THREE.Mesh(sunGeometry, this.sunMaterial);
    sunMesh.name = spaceObject.name;
    sunMesh.castShadow = false;
    sunMesh.receiveShadow = false;

    return sunMesh;
  }

  createGlowMaterial(spaceObject: SpaceObject, mesh: THREE.Mesh) {
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

  createSpaceObject(spaceObject: SpaceObject): THREE.Mesh {
    return this.getSpaceObjectMesh(
      new THREE.SphereGeometry(this.calcRadiusPx(spaceObject.radius), 32, 32),
      this.getSpaceObjectMaterial(spaceObject),
      spaceObject
    );
  }

  createSpaceBackground(): THREE.Mesh {
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

  createLabelSprite(
    text: string,
    platformAdapter: PlatformAdapter
  ): THREE.Sprite | undefined {
    // Создаём canvas для текста
    const canvas = platformAdapter.getCanvasWithoutAddToDom();

    if (!canvas) return;

    const context = canvas.getContext("2d")!;
    context.font = "24px Arial, sans-serif";
    context.textAlign = "center";

    // Рисуем текст
    context.fillStyle = "white";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Создаём текстуру из canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true; // Обязательно для первого рендера

    // Создаём материал и спрайт
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: true, // Чтобы скрывался за объектами
    });

    const sprite = new THREE.Sprite(material);

    return sprite;
  }

  getSunMaterial() {
    return this.sunMaterial;
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

  private getSpaceObjectMesh(
    geometry: THREE.SphereGeometry,
    material: THREE.MeshPhongMaterial,
    spaceObject: SpaceObject
  ) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = spaceObject.name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  private calcRadiusPx(radius: number) {
    return (
      radius *
      SIMULATION_CONFIG.SCALE_DIST *
      SIMULATION_CONFIG.OBJECTS_RADIUS_SCALE
    );
  }
}
