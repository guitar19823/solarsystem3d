import { solarSystem } from "../config/solar-system-config";
import { SIMULATION_CONFIG } from "../config/simulation-config";
import { Vector3D } from "../physics/vector-3d";
import { CelestialBody } from "../entities/celestial-body";

export class SolarSystem {
  private flatten: CelestialBody[];
  private solarSystem: CelestialBody;
  private dt: number;

  constructor(dt: number = SIMULATION_CONFIG.DEFAULT_DT) {
    this.dt = dt;

    this.solarSystem = solarSystem;
    this.flatten = this.flattenArray(this.solarSystem);
  }

  public getSolarSystem(): CelestialBody {
    return solarSystem;
  }

  public update(
    dt: number = this.dt,
    body: CelestialBody = this.solarSystem
  ): void {
    const children = body.children;

    if (!children) return;

    children.forEach((obj) => {
      obj.update(dt, children);

      if (obj.children) {
        this.update(dt, obj);
      }
    });
  }

  public applyCameraVelocityImpulse(dx: number, dy: number, dz: number): void {
    const camera = this.flatten.find((obj) => obj.name === "Camera");

    if (camera) {
      camera.vel = camera.vel.add(new Vector3D(dx, dy, dz));
    } else {
      console.warn("Камера не найдена в системе!");
    }
  }

  private flattenArray(body: CelestialBody) {
    const result: CelestialBody[] = [];

    body.children?.forEach((obj) => {
      if (obj.children) {
        result.push(...this.flattenArray(obj));
      } else {
        result.push(obj);
      }
    });

    return result;
  }
}
