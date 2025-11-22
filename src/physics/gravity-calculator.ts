import { CelestialBody } from "../entities/celestial-body";
import { Vector3D } from "./vector-3d";

export class GravityCalculator {
  static readonly G = 6.6743e-11; // м³·кг⁻¹·с⁻²

  static calculateAcceleration(
    spaceObject: CelestialBody,
    others: CelestialBody[]
  ): Vector3D {
    let acc = new Vector3D();

    for (const other of others) {
      if (other === spaceObject) continue;
      if (other.children) continue; // пропускаем контейнеры

      const r = other.pos.subtract(spaceObject.pos); // вектор к другому телу
      const distSq = r.magnitudeSquared(); // используем метод Vector3D

      if (distSq < 1e-20) continue; // слишком близко — пропускаем

      const dist = Math.sqrt(distSq); // корень нужен только для minDist
      const minDist = spaceObject.radius + other.radius;

      if (dist < minDist) {
        // console.warn(`Столкновение: ${spaceObject.name} и ${other.name}`);
        continue;
      }

      // Ускорение: a = G * M / r²
      const accMagnitude = (this.G * other.totalMass) / distSq;
      acc = acc.add(r.normalize().multiply(accMagnitude));
    }

    return acc;
  }
}
