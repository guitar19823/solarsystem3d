import { Vector3D } from "../physics/vector";
import { PLANET_DATA, PlanetConfig } from "./planet-data";
import { SIMULATION_CONFIG } from "./simulation-config";

export interface SimulationConfig {
  SIMULATION_DT: number;
  DEFAULT_DT: number;
  MAX_DT: number;
  AU_IN_PX: number;
  PLANET_RADIUS_SCALE: number;
}

export class ConfigAPI {
  private static planetData: PlanetConfig[] = [...PLANET_DATA]; // изначальные данные

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
    SIMULATION_CONFIG._scaleDistCached = 0;
  }

  static getScale(): number {
    return SIMULATION_CONFIG.AU_IN_PX;
  }

  static setPlanetScale(scale: number): void {
    if (scale <= 0) {
      throw new Error("Planet radius scale must be positive");
    }
    SIMULATION_CONFIG.PLANET_RADIUS_SCALE = scale;
  }

  static getPlanetScale(): number {
    return SIMULATION_CONFIG.PLANET_RADIUS_SCALE;
  }

  static addPlanet(config: PlanetConfig): void {
    const existing = ConfigAPI.getPlanet(config.name);
    if (existing) {
      throw new Error(`Planet with name "${config.name}" already exists`);
    }
    ConfigAPI.planetData.push(config);
  }

  static removePlanet(name: string): boolean {
    const index = ConfigAPI.findPlanetIndex(name);
    if (index === -1) {
      return false;
    }
    ConfigAPI.planetData.splice(index, 1);
    return true;
  }

  static updatePlanet(name: string, updates: Partial<PlanetConfig>): boolean {
    const planet = ConfigAPI.getPlanet(name);
    if (!planet) {
      return false;
    }

    Object.assign(planet, updates);
    return true;
  }

  static getPlanet(name: string): PlanetConfig | undefined {
    return ConfigAPI.planetData.find((p) => p.name === name);
  }

  static getAllPlanets(): PlanetConfig[] {
    return [...ConfigAPI.planetData]; // возвращаем копию
  }

  private static findPlanetIndex(name: string): number {
    return ConfigAPI.planetData.findIndex((p) => p.name === name);
  }

  static resetSimulationConfig(): void {
    SIMULATION_CONFIG.SIMULATION_DT = 1;
    SIMULATION_CONFIG.DEFAULT_DT = 86400;
    SIMULATION_CONFIG.MAX_DT = 864000;
    SIMULATION_CONFIG.AU_IN_PX = 100;
    SIMULATION_CONFIG.PLANET_RADIUS_SCALE = 1;
    SIMULATION_CONFIG._scaleDistCached = 0;
  }

  static resetPlanetData(): void {
    ConfigAPI.planetData = [
      {
        name: "Sun",
        mass: 1.989e30,
        pos: new Vector3D(0, 0, 0),
        vel: new Vector3D(0, 0, 0),
        color: "yellow",
        radius: 696340000,
      },
      // ... остальные планеты как в исходном PLANET_DATA
    ];
  }
}
