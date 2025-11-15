import { PlatformAdapter } from "./types/platform-adapter";
import { ThreeRenderer } from "./rendering/three-renderer";
import { SolarSystem } from "./simulation/solar-system";
import { SIMULATION_CONFIG } from "./config/simulation-config";
import { BrowserAdapter } from "./adapters/browser-adapter";
import { ConfigAPI } from "./config/config-api";

export function runSimulation(platformAdapter: PlatformAdapter) {
  const canvas = platformAdapter.createCanvas();
  const renderer = new ThreeRenderer(canvas);
  platformAdapter.appendToDom(canvas);

  // Элемент для отображения FPS (создайте в HTML)
  const fpsElement = document.createElement("div");
  fpsElement.style.position = "absolute";
  fpsElement.style.top = "10px";
  fpsElement.style.right = "10px";
  fpsElement.style.color = "lime";
  document.body.appendChild(fpsElement);
  renderer.setFpsElement(fpsElement);

  const system = new SolarSystem(SIMULATION_CONFIG.MAX_DT);
  renderer.initPlanets(system.getPlanets());

  let lastTimestamp = 0;

  function animate(currentTimestamp: number) {
    const deltaTime = currentTimestamp - lastTimestamp;
    lastTimestamp = currentTimestamp;

    // Ограничиваем максимальный шаг симуляции
    const simulationTimeStep = Math.min(
      (deltaTime / 1000) * SIMULATION_CONFIG.SIMULATION_DT,
      SIMULATION_CONFIG.MAX_DT
    );

    system.step(simulationTimeStep);
    renderer.updatePlanets(system.getPlanets());
    renderer.render(deltaTime); // передаём deltaTime для расчёта FPS

    platformAdapter.requestAnimationFrame(animate);
  }

  platformAdapter.requestAnimationFrame(animate);

  // Обработчик resize
  platformAdapter.onResize(() => {
    renderer.resize(window.innerWidth, window.innerHeight);
  });
}

function initControls() {
  const speedSlider = document.getElementById(
    "speed-slider"
  ) as HTMLInputElement;

  const speedValue = document.getElementById("speed-value");

  speedSlider.value = SIMULATION_CONFIG.SIMULATION_DT.toString();

  if (speedValue) {
    speedValue.textContent = SIMULATION_CONFIG.SIMULATION_DT.toString();

    speedSlider.addEventListener("input", () => {
      const value = parseInt(speedSlider.value, 10);
      ConfigAPI.setSimulationSpeed(value);
      speedValue.textContent = value.toString();
    });
  }
}

const platformAdapter = new BrowserAdapter();

runSimulation(platformAdapter);
initControls();
