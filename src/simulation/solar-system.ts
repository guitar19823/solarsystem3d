import { SpaceObject } from "../entities/space-object";
import { SPACE_OBJECTS } from "../config/space-objects";
import { SIMULATION_CONFIG } from "../config/simulation-config";
import { Vector3D } from "../physics/vector";

export class SolarSystem {
  private spaceObjects: SpaceObject[] = [];
  private dt: number;

  constructor(dt: number = SIMULATION_CONFIG.DEFAULT_DT) {
    this.dt = dt;
    this.initSpaceObjects();
  }

  private initSpaceObjects() {
    for (const config of SPACE_OBJECTS) {
      this.spaceObjects.push(
        new SpaceObject(
          config.name,
          config.mass,
          config.pos,
          config.vel,
          config.color,
          config.radius,
          config.texture
        )
      );
    }
  }

  getSpaceObjects() {
    return this.spaceObjects;
  }

  step(dt: number = this.dt) {
    const spaceObjectsCopy = [...this.spaceObjects];

    for (const spaceObject of this.spaceObjects) {
      spaceObject.update(dt, spaceObjectsCopy);
    }
  }

  public applyCameraVelocityImpulse(dx: number, dy: number, dz: number): void {
    const camera = this.spaceObjects.find((obj) => obj.name === "Camera");

    if (camera) {
      camera.vel = camera.vel.add(new Vector3D(dx, dy, dz));
    }
  }
}
