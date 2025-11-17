import { Vector3D } from "../physics/vector";
import { SPACE_OBJECTS, ISpaceObjectConfig } from "./space-objects";
import { SIMULATION_CONFIG } from "./simulation-config";

export interface SimulationConfig {
  SIMULATION_DT: number;
  DEFAULT_DT: number;
  MAX_DT: number;
  AU_IN_PX: number;
  OBJECTS_RADIUS_SCALE: number;
}

export class ConfigAPI {
  private static spaceObjects: ISpaceObjectConfig[] = [...SPACE_OBJECTS]; // изначальные данные

  static setSimulationSpeed(factor: number): void {
    if (factor <= 0) {
      throw new Error("Simulation speed factor must be positive");
    }
    SIMULATION_CONFIG.SIMULATION_DT = factor;
  }

  static getSimulationSpeed(): number {
    return SIMULATION_CONFIG.SIMULATION_DT;
  }

  static setScale(auInPx: number): void {
    if (auInPx <= 0) {
      throw new Error("AU in pixels must be positive");
    }
    SIMULATION_CONFIG.AU_IN_PX = auInPx;
  }

  static getScale(): number {
    return SIMULATION_CONFIG.AU_IN_PX;
  }

  static setSpaceObjectScale(scale: number): void {
    if (scale <= 0) {
      throw new Error("SpaceObject radius scale must be positive");
    }
    SIMULATION_CONFIG.OBJECTS_RADIUS_SCALE = scale;
  }

  static getSpaceObjectScale(): number {
    return SIMULATION_CONFIG.OBJECTS_RADIUS_SCALE;
  }

  static getLabelScaleFactor(): number {
    return SIMULATION_CONFIG.LABEL_SCALE_FATOR;
  }

  static setLabelScaleFactor(factor: number): void {
    if (factor <= 0) {
      throw new Error("Label scale factor must be positive");
    }
    SIMULATION_CONFIG.LABEL_SCALE_FATOR = factor;
  }

  static getSpeedFactor(): number {
    return SIMULATION_CONFIG.SPEED_FACTOR * 10000000;
  }

  static setSpeedFactor(factor: number): void {
    if (factor <= 0) {
      throw new Error("Label scale factor must be positive");
    }
    SIMULATION_CONFIG.SPEED_FACTOR = factor / 10000000;
  }

  static addSpaceObject(config: ISpaceObjectConfig): void {
    const existing = ConfigAPI.getSpaceObject(config.name);
    if (existing) {
      throw new Error(`SpaceObject with name "${config.name}" already exists`);
    }
    ConfigAPI.spaceObjects.push(config);
  }

  static removeSpaceObject(name: string): boolean {
    const index = ConfigAPI.findSpaceObjectIndex(name);
    if (index === -1) {
      return false;
    }
    ConfigAPI.spaceObjects.splice(index, 1);
    return true;
  }

  static updateSpaceObject(
    name: string,
    updates: Partial<ISpaceObjectConfig>
  ): boolean {
    const spaceObject = ConfigAPI.getSpaceObject(name);
    if (!spaceObject) {
      return false;
    }

    Object.assign(spaceObject, updates);
    return true;
  }

  static getSpaceObject(name: string): ISpaceObjectConfig | undefined {
    return ConfigAPI.spaceObjects.find((p) => p.name === name);
  }

  static getAllSpaceObjects(): ISpaceObjectConfig[] {
    return [...ConfigAPI.spaceObjects]; // возвращаем копию
  }

  private static findSpaceObjectIndex(name: string): number {
    return ConfigAPI.spaceObjects.findIndex((p) => p.name === name);
  }

  static resetSimulationConfig(): void {
    SIMULATION_CONFIG.SIMULATION_DT = 1;
    SIMULATION_CONFIG.DEFAULT_DT = 86400;
    SIMULATION_CONFIG.MAX_DT = 864000;
    SIMULATION_CONFIG.AU_IN_PX = 100;
    SIMULATION_CONFIG.OBJECTS_RADIUS_SCALE = 1;
  }

  static resetSpaceObjectData(): void {
    ConfigAPI.spaceObjects = [
      {
        name: "Sun",
        mass: 1.989e30,
        pos: new Vector3D(0, 0, 0),
        vel: new Vector3D(0, 0, 0),
        color: "yellow",
        radius: 696340000,
      },
      // ... остальные планеты как в исходном SPACE_OBJECTS
    ];
  }
}
