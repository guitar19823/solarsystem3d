import { Vector3D } from "../physics/vector";

export interface ISpaceObjectConfig {
  name: string;
  mass: number;
  pos: Vector3D;
  vel: Vector3D;
  color: string;
  radius: number; // в метрах
  texture?: string;
}

export const SPACE_OBJECTS: ISpaceObjectConfig[] = [
  {
    name: "Sun",
    mass: 1.989e30,
    pos: new Vector3D(0, 0, 0),
    vel: new Vector3D(0, 0, -0),
    color: "white",
    radius: 696340000,
  },
  {
    name: "Mercury",
    mass: 3.3011e23,
    pos: new Vector3D(5.791e10, 0, 0),
    vel: new Vector3D(0, 0, -47362),
    color: "gray",
    radius: 2439700,
    texture: "mercuryhigh-min.jpg",
  },
  {
    name: "Venus",
    mass: 4.8675e24,
    pos: new Vector3D(1.082e11, 0, 0),
    vel: new Vector3D(0, 0, -35020),
    color: "orange",
    radius: 6051800,
    texture: "venushigh-min.jpg",
  },
  {
    name: "Earth",
    mass: 5.972e24,
    pos: new Vector3D(1.496e11, 0, 0),
    vel: new Vector3D(0, 0, -29783),
    color: "blue",
    radius: 6371000,
    texture: "earthhigh-min.jpg",
  },
  {
    name: "Mars",
    mass: 6.4171e23,
    pos: new Vector3D(2.279e11, 0, 0),
    vel: new Vector3D(0, 0, -24077),
    color: "red",
    radius: 3389500,
    texture: "marshigh-min.jpg",
  },
  {
    name: "Jupiter",
    mass: 1.8982e27,
    pos: new Vector3D(7.785e11, 0, 0),
    vel: new Vector3D(0, 0, -13070),
    color: "brown",
    radius: 69911000,
    texture: "jupiterhigh-min.jpg",
  },
  {
    name: "Saturn",
    mass: 5.6834e26,
    pos: new Vector3D(1.434e12, 0, 0),
    vel: new Vector3D(0, 0, -9690),
    color: "gold",
    radius: 58232000,
    texture: "saturnhigh-min.jpg",
  },
  {
    name: "Uranus",
    mass: 8.681e25,
    pos: new Vector3D(2.871e12, 0, 0),
    vel: new Vector3D(0, 0, -6810),
    color: "lightblue",
    radius: 25362000,
    texture: "uranushigh-min.jpg",
  },
  {
    name: "Neptune",
    mass: 1.0241e26,
    pos: new Vector3D(4.495e12, 0, 0),
    vel: new Vector3D(0, 0, -5430),
    color: "darkblue",
    radius: 24622000,
    texture: "neptunehigh-min.jpg",
  },
];
