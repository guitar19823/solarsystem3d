import * as THREE from "three";
import { PlatformAdapter } from "./adapters/platform-adapter";
import { BrowserAdapter } from "./adapters/browser-adapter";
import { SolarSystem } from "./simulation/solar-system";
import { SIMULATION_CONFIG } from "./config/simulation-config";
import { ConfigAPI } from "./config/config-api";

import { SceneManager } from "./rendering/scene-manager";
import { CameraController } from "./rendering/camera-controller";
import { TextureManager } from "./rendering/texture-manager";
import { ObjectFactory } from "./rendering/object-factory";
import { RendererCore } from "./rendering/renderer-core";

export function runSimulation(platformAdapter: PlatformAdapter) {
  const sceneManager = new SceneManager();
  const textureManager = new TextureManager();
  const objectFactory = new ObjectFactory(textureManager);
  const cameraController = new CameraController(platformAdapter);

  const renderer = new RendererCore(
    platformAdapter,
    sceneManager,
    cameraController,
    objectFactory
  );

  renderer.initialize();

  const fpsElement = document.createElement("div");
  fpsElement.style.position = "absolute";
  fpsElement.style.top = "10px";
  fpsElement.style.right = "10px";
  fpsElement.style.color = "lime";
  document.body.appendChild(fpsElement);
  renderer.setFpsElement(fpsElement);

  const system = new SolarSystem(SIMULATION_CONFIG.MAX_DT);

  renderer.initSpaceObjects(system.getSpaceObjects());

  let lastTimestamp = 0;

  function animate(currentTimestamp: number) {
    const deltaTime = currentTimestamp - lastTimestamp;
    lastTimestamp = currentTimestamp;

    const simulationTimeStep = Math.min(
      (deltaTime / 1000) * SIMULATION_CONFIG.SIMULATION_DT,
      SIMULATION_CONFIG.MAX_DT
    );

    system.step(simulationTimeStep);
    renderer.updateSpaceObjects(system.getSpaceObjects());
    renderer.render(deltaTime);

    platformAdapter.requestAnimationFrame(animate);
  }

  platformAdapter.requestAnimationFrame(animate);

  platformAdapter.onResize(() => {
    renderer.initialize();
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
