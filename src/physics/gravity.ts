import { SpaceObject } from "../entities/space-object";
import { Vector3D } from "./vector";

export class GravityCalculator {
  static readonly G = 6.6743e-11; // м³·кг⁻¹·с⁻²

  static calculateAcceleration(
    spaceObject: SpaceObject,
    others: SpaceObject[]
  ): Vector3D {
    let acc = new Vector3D();

    for (const other of others) {
      if (other === spaceObject) continue;

      const dx = other.pos.x - spaceObject.pos.x;
      const dy = other.pos.y - spaceObject.pos.y;
      const dz = other.pos.z - spaceObject.pos.z;
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < 1e-20) continue;

      const dist = Math.sqrt(distSq);
      const minDist = spaceObject.radius + other.radius;

      if (dist < minDist) {
        console.warn(`Столкновение: ${spaceObject.name} и ${other.name}`);
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
