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
import { MiniMap } from "./rendering/mini-map";
import { FPS } from "./rendering/fps";

export function runSimulation(platformAdapter: PlatformAdapter) {
  const system = new SolarSystem(SIMULATION_CONFIG.MAX_DT);
  const sceneManager = new SceneManager();
  const textureManager = new TextureManager();
  const cameraController = new CameraController(platformAdapter, system);
  const miniMap = new MiniMap(platformAdapter);
  const fps = new FPS(platformAdapter);

  const objectFactory = new ObjectFactory(
    platformAdapter,
    textureManager,
    sceneManager,
    cameraController,
    system
  );

  const renderer = new RendererCore(
    platformAdapter,
    sceneManager,
    cameraController,
    objectFactory,
    miniMap,
    system,
    fps
  );

  renderer.init();

  let lastTimestamp = 0;

  function animate(currentTimestamp: number) {
    const deltaTime = currentTimestamp - lastTimestamp;
    lastTimestamp = currentTimestamp;

    system.update(
      Math.min(
        (deltaTime / 1000) * SIMULATION_CONFIG.SIMULATION_DT,
        SIMULATION_CONFIG.MAX_DT
      )
    );

    renderer.render(deltaTime);

    platformAdapter.requestAnimationFrame(animate);
  }

  platformAdapter.requestAnimationFrame(animate);
}

function initControls() {
  const speedSlider = document.getElementById(
    "speed-slider"
  ) as HTMLInputElement;
  const speedValue = document.getElementById("speed-value");

  if (speedValue) {
    const getSimulationSpeed = ConfigAPI.getSimulationSpeed();
    speedSlider.value = getSimulationSpeed.toString();
    speedValue.textContent = getSimulationSpeed.toString();

    speedSlider.addEventListener("input", () => {
      const value = parseInt(speedSlider.value, 10);
      ConfigAPI.setSimulationSpeed(value);
      speedValue.textContent = value.toString();
    });
  }

  // Управление масштабом меток (labelScaleFactor)
  const labelScaleSlider = document.getElementById(
    "label-scale-slider"
  ) as HTMLInputElement;
  const labelScaleValue = document.getElementById("label-scale-value");

  if (labelScaleSlider && labelScaleValue) {
    const labelScaleFactor = ConfigAPI.getLabelScaleFactor().toString();
    labelScaleSlider.value = labelScaleFactor;
    labelScaleValue.textContent = labelScaleFactor;

    labelScaleSlider.addEventListener("input", () => {
      const value = parseFloat(labelScaleSlider.value);
      ConfigAPI.setLabelScaleFactor(value);
      labelScaleValue.textContent = value.toString();
    });
  }

  // Управление impulseStrength (множитель ускорения)
  const impulseStrength = document.getElementById(
    "impulse-strength-slider"
  ) as HTMLInputElement;
  const speedFactorValue = document.getElementById("impulse-strength-value");

  if (impulseStrength && speedFactorValue) {
    const speedFactor = ConfigAPI.getImpulseStrength().toString();
    impulseStrength.value = speedFactor;
    speedFactorValue.textContent = speedFactor;

    impulseStrength.addEventListener("input", () => {
      const value = parseFloat(impulseStrength.value);
      ConfigAPI.setImpulseStrength(value);
      speedFactorValue.textContent = value.toString();
    });
  }
}

const platformAdapter = new BrowserAdapter();
runSimulation(platformAdapter);
initControls();
