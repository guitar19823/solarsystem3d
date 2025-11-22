import { Vector3D } from "../physics/vector-3d";

export interface ICelestialBody {
  name: string;
  pos: Vector3D;
  vel: Vector3D;
  radius: number;
  color: string;
  mass?: number; // масса только для «листовых» тел
  texture?: string;
  rotationPeriod?: number;
  axialTilt?: number;
  children?: ICelestialBody[];
}
