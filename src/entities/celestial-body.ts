import { Vector3D } from "../physics/vector";
import { ISpaceObject } from "./interface";

export abstract class CelestialBody implements ISpaceObject {
  constructor(
    public name: string,
    public mass: number,
    public pos: Vector3D,
    public vel: Vector3D,
    public color: string,
    public radius: number,
    public texture: string | undefined
  ) {}

  abstract update(dt: number, others: ISpaceObject[]): void;
}
