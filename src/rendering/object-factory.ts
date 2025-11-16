import * as THREE from "three";
import { SpaceObject } from "../entities/space-object";
import { IObjectFactory, ITextureManager } from "./interfaces";
import { SIMULATION_CONFIG } from "../config/simulation-config";

export class ObjectFactory implements IObjectFactory {
  private textureManager: ITextureManager;

  constructor(textureManager: ITextureManager) {
    this.textureManager = textureManager;
  }

  createSpaceObject(spaceObject: SpaceObject): THREE.Mesh {
    const radiusPx =
      spaceObject.radius *
      SIMULATION_CONFIG.SCALE_DIST *
      SIMULATION_CONFIG.OBJECTS_RADIUS_SCALE;

    const geometry = new THREE.SphereGeometry(radiusPx, 32, 32);
    let material: THREE.Material;

    if (spaceObject.texture) {
      const texture = this.textureManager.loadTexture(spaceObject.texture);

      material = new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.05,
        color: 0xffffff,
        shininess: 30,
        specular: new THREE.Color(0x333333),
      });
    } else {
      material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(spaceObject.color),
        shininess: 5,
        specular: new THREE.Color(0x333333),
      });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = spaceObject.name;

    return mesh;
  }
}
