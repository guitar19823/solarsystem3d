import { Vector3D } from "../physics/vector";
import { Planet } from "./planet.interface";

export abstract class CelestialBody implements Planet {
  constructor(
    public name: string,
    public mass: number,
    public pos: Vector3D,
    public vel: Vector3D,
    public color: string,
    public radius: number,
    public texture: string | undefined
  ) {}

  abstract update(dt: number, others: Planet[]): void;
}
