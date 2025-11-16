import { Vector3D } from "../physics/vector";

export interface ISpaceObject {
  name: string;
  mass: number;
  pos: Vector3D;
  vel: Vector3D;
  color: string;
  radius: number; // в метрах
  texture?: string;
}
