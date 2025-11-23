import { SIMULATION_CONFIG } from "../config/simulation-config";
import { GravityCalculator } from "../physics/gravity-calculator";
import { Vector3D } from "../physics/vector-3d";
import { ICelestialBody } from "./interface";

export class CelestialBody {
  name: string;
  color: string;
  pos: Vector3D;
  vel: Vector3D;
  radius: number;
  mass?: number;
  texture?: string;
  rotationPeriod?: number;
  axialTilt?: number;
  children?: CelestialBody[];

  constructor(data: ICelestialBody) {
    this.name = data.name;
    this.pos = data.pos;
    this.vel = data.vel;
    this.radius = data.radius;
    this.mass = data.mass;
    this.texture = data.texture;
    this.color = data.color;
    this.rotationPeriod = data.rotationPeriod;
    this.axialTilt = data.axialTilt;
    // @ts-expect-error
    this.children = data.children;
  }

  get totalMass(): number {
    if (typeof this.mass === "number") return this.mass;
    if (this.children)
      return this.children.reduce((sum, child) => sum + child.totalMass, 0);
    return 0;
  }

  public update(dt: number, others: CelestialBody[]): void {
    // Метод (Верле)
    const posOld = this.pos.clone();
    const acc = GravityCalculator.calculateAcceleration(this, others);

    this.pos = posOld
      .add(this.vel.multiply(dt))
      .add(acc.multiply(0.5 * dt * dt));

    const accNew = GravityCalculator.calculateAcceleration(this, others);
    this.vel = this.vel.add(acc.add(accNew).multiply(0.5 * dt));
  }

  public updateEyler(dt: number, others: CelestialBody[]): void {
    // Метод (Эйлер)
    const acc = GravityCalculator.calculateAcceleration(this, others);
    this.vel = this.vel.add(acc.multiply(dt));
    this.pos = this.pos.add(this.vel.multiply(dt));
  }
}
