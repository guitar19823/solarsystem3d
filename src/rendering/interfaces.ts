import * as THREE from "three";
import { SpaceObject } from "../entities/space-object";
import { PlatformAdapter } from "../adapters/platform-adapter";

export interface ITextureManager {
  loadTexture(path: string): THREE.Texture;
}

export interface IObjectFactory {
  createSunMaterial(spaceObject: SpaceObject): THREE.Mesh;
  createGlowMaterial(spaceObject: SpaceObject, mesh: THREE.Mesh): THREE.Mesh;
  createSpaceObject(spaceObject: SpaceObject): THREE.Mesh;
  createSpaceBackground(): THREE.Mesh;
  createLabelSprite(
    text: string,
    platformAdapter: PlatformAdapter
  ): THREE.Sprite | undefined;
  getSunMaterial(): THREE.ShaderMaterial | undefined;
}

export interface ISceneManager {
  getScene(): THREE.Scene;
  setupLighting(): void;
}

export interface ICameraController {
  /**
   * Обновляет состояние камеры (например, применяет damping, обрабатывает ввод).
   */
  update(): void;

  /**
   * Изменяет размеры viewport (при ресайзе окна).
   * @param width Новая ширина в пикселях.
   * @param height Новая высота в пикселях.
   */
  resize(width: number, height: number): void;

  /**
   * Возвращает текущую камеру Three.js.
   */
  getCamera(): THREE.PerspectiveCamera;

  /**
   * Устанавливает точку, на которую смотрит камера.
   * @param target Целевая позиция в 3D-пространстве.
   */
  lookAt(target: THREE.Vector3): void;

  /**
   * Перемещает камеру в указанную позицию.
   * @param position Новая позиция камеры.
   */
  setPosition(position: THREE.Vector3): void;

  /**
   * Сбрасывает камеру в начальное состояние (например, после смены объекта наблюдения).
   */
  reset(): void;

  /**
   * Включает/отключает управление камерой (например, при открытии модального окна).
   * @param enabled true — управление разрешено, false — заблокировано.
   */
  setEnabled(enabled: boolean): void;

  /**
   * Возвращает текущее положение камеры.
   */
  getPosition(): THREE.Vector3;

  /**
   * Возвращает направление, в котором смотрит камера.
   */
  getDirection(): THREE.Vector3;
}
