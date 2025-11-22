import { Vector3D } from "../physics/vector-3d";
import { SIMULATION_CONFIG } from "./simulation-config";

export interface SimulationConfig {
  SIMULATION_DT: number;
  DEFAULT_DT: number;
  MAX_DT: number;
  AU_IN_PX: number;
  OBJECTS_RADIUS_SCALE: number;
}

export class ConfigAPI {
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
      throw new Error("Speed factor must be positive");
    }
    SIMULATION_CONFIG.SPEED_FACTOR = factor / 10000000;
  }

  static getImpulseStrength(): number {
    return SIMULATION_CONFIG.IMPULSE_STRENGTH;
  }

  static setImpulseStrength(factor: number): void {
    if (factor <= 0) {
      throw new Error("Impulse strength must be positive");
    }
    SIMULATION_CONFIG.IMPULSE_STRENGTH = factor;
  }

  static resetSimulationConfig(): void {
    SIMULATION_CONFIG.SIMULATION_DT = 1;
    SIMULATION_CONFIG.DEFAULT_DT = 86400;
    SIMULATION_CONFIG.MAX_DT = 864000;
    SIMULATION_CONFIG.AU_IN_PX = 100;
    SIMULATION_CONFIG.OBJECTS_RADIUS_SCALE = 1;
  }
}
