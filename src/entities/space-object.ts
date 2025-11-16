import { CelestialBody } from "./celestial-body";
import { GravityCalculator } from "../physics/gravity";

export class SpaceObject extends CelestialBody {
  update(dt: number, others: SpaceObject[]) {
    // Метод (Эйлер)
    // const acc = GravityCalculator.calculateAcceleration(this, others);
    // this.vel = this.vel.add(acc.multiply(dt));
    // this.pos = this.pos.add(this.vel.multiply(dt));

    // Метод (Верле)
    const posOld = this.pos;
    const acc = GravityCalculator.calculateAcceleration(this, others);

    this.pos = posOld
      .add(this.vel.multiply(dt))
      .add(acc.multiply(0.5 * dt * dt));

    const accNew = GravityCalculator.calculateAcceleration(this, others);
    this.vel = this.vel.add(acc.add(accNew).multiply(0.5 * dt));
  }
}
