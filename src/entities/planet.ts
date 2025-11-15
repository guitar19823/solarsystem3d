import { CelestialBody } from "./celestial-body";
import { GravityCalculator } from "../physics/gravity";

export class Planet extends CelestialBody {
  update(dt: number, others: Planet[]) {
    // Метод (Эйлер)
    // const acc = GravityCalculator.calculateAcceleration(this, others);
    // this.vel = this.vel.add(acc.multiply(dt));
    // this.pos = this.pos.add(this.vel.multiply(dt));

    // Метод (Верле)
    // Шаг 1: Сохраняем текущую позицию
    const posOld = this.pos;

    // Шаг 2: Обновляем позицию по формуле Верле
    const acc = GravityCalculator.calculateAcceleration(this, others);

    this.pos = posOld
      .add(this.vel.multiply(dt))
      .add(acc.multiply(0.5 * dt * dt));

    // Шаг 3: Вычисляем новое ускорение (на обновлённой позиции)
    const accNew = GravityCalculator.calculateAcceleration(this, others);

    // Шаг 4: Обновляем скорость
    this.vel = this.vel.add(acc.add(accNew).multiply(0.5 * dt));
  }
}
