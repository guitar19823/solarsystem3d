import { Planet } from "../entities/planet";
import { Vector3D } from "./vector";

export class GravityCalculator {
  static readonly G = 6.6743e-11; // м³·кг⁻¹·с⁻²

  static calculateAcceleration(planet: Planet, others: Planet[]): Vector3D {
    let acc = new Vector3D();

    for (const other of others) {
      if (other === planet) continue;

      const dx = other.pos.x - planet.pos.x;
      const dy = other.pos.y - planet.pos.y;
      const dz = other.pos.z - planet.pos.z;
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < 1e-20) continue;

      const dist = Math.sqrt(distSq);
      const minDist = planet.radius + other.radius;

      if (dist < minDist) {
        console.warn(`Столкновение: ${planet.name} и ${other.name}`);
        continue;
      }

      const forceFactor = (this.G * other.mass) / (dist * distSq);

      acc = acc.add(
        new Vector3D(forceFactor * dx, forceFactor * dy, forceFactor * dz)
      );
    }

    return acc;
  }
}
