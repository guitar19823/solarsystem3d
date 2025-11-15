import { Planet } from "../entities/planet";
import { PLANET_DATA } from "../config/planet-data";
import { SIMULATION_CONFIG } from "../config/simulation-config";

export class SolarSystem {
  private planets: Planet[] = [];
  private dt: number;

  constructor(dt: number = SIMULATION_CONFIG.DEFAULT_DT) {
    this.dt = dt;
    this.initPlanets();
  }

  private initPlanets() {
    for (const config of PLANET_DATA) {
      this.planets.push(
        new Planet(
          config.name,
          config.mass,
          config.pos,
          config.vel,
          config.color,
          config.radius
        )
      );
    }
  }

  getPlanets() {
    return this.planets;
  }

  step(dt: number = this.dt) {
    const planetsCopy = [...this.planets];

    for (const planet of this.planets) {
      planet.update(dt, planetsCopy);
    }
  }
}
