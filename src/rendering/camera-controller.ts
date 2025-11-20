import * as THREE from "three";
import { ICameraController } from "./interfaces";
import {
  CanvasName,
  Command,
  PlatformAdapter,
} from "../adapters/platform-adapter";
import { SIMULATION_CONFIG } from "../config/simulation-config";
import { SolarSystem } from "../simulation/solar-system";

export class CameraController implements ICameraController {
  private camera: THREE.PerspectiveCamera;
  private target: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private velocity: THREE.Vector2 = new THREE.Vector2(0, 0);
  private mousePrev: THREE.Vector2 = new THREE.Vector2();
  private mouseCurr: THREE.Vector2 = new THREE.Vector2();

  private yaw: number = 0;
  private pitch: number = 0;
  private commands = new Set();
  private isMouseDown: boolean = false;

  constructor(
    platformAdapter: PlatformAdapter,
    private solarSystem: SolarSystem
  ) {
    this.camera = new THREE.PerspectiveCamera(
      65,
      platformAdapter.getWidth() / platformAdapter.getHeight(),
      0.001,
      50000000000
    );

    this.setupEvents(platformAdapter);
    this.updateCamera();
  }

  public update(): void {
    this.updateCamera();
  }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public lookAt(target: THREE.Vector3): void {
    this.target.copy(target);
    this.updateCamera();
  }

  public setPosition(position: THREE.Vector3): void {
    this.camera.position.copy(position);
    this.target.copy(position);
    this.updateCamera();
  }

  public getPosition(): THREE.Vector3 {
    return this.camera.position;
  }

  public getDirection(): THREE.Vector3 {
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);

    return direction;
  }

  private setupEvents(platformAdapter: PlatformAdapter): void {
    platformAdapter.onPress((x, y) => {
      this.isMouseDown = true;
      this.mousePrev.set(x, y);
    }, CanvasName.MAIN_SCENE);

    platformAdapter.onRelease(() => {
      this.isMouseDown = false;
    }, CanvasName.MAIN_SCENE);

    platformAdapter.onLeave(() => {
      this.isMouseDown = false;
    }, CanvasName.MAIN_SCENE);

    platformAdapter.onMove((x, y) => {
      if (this.isMouseDown) {
        this.mouseCurr.set(x, y);
        this.handleMouseRotate();
        this.mousePrev.copy(this.mouseCurr);
      }
    }, CanvasName.MAIN_SCENE);

    platformAdapter.onZoom((value) => {
      const zoomSpeed = 10;
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(this.camera.quaternion);
      this.target.addScaledVector(direction, value * 0.01 * zoomSpeed);
      this.updateCamera();
    }, CanvasName.MAIN_SCENE);

    platformAdapter.onPressButton((value) => {
      this.commands.add(value);

      const { cameraZAxis, cameraXAxis, cameraYAxis } = this.getCameraAxes();

      let impulse = new THREE.Vector3(0, 0, 0);
      const impulseStrength = SIMULATION_CONFIG.IMPULSE_STRENGTH;

      if (this.commands.has(Command.forward))
        impulse.copy(cameraZAxis).multiplyScalar(impulseStrength);

      if (this.commands.has(Command.back))
        impulse.copy(cameraZAxis).multiplyScalar(-impulseStrength);

      if (this.commands.has(Command.left))
        impulse.copy(cameraXAxis).multiplyScalar(-impulseStrength);

      if (this.commands.has(Command.right))
        impulse.copy(cameraXAxis).multiplyScalar(impulseStrength);

      if (this.commands.has(Command.up))
        impulse.copy(cameraYAxis).multiplyScalar(impulseStrength);

      if (this.commands.has(Command.down))
        impulse.copy(cameraYAxis).multiplyScalar(-impulseStrength);


      this.solarSystem.applyCameraVelocityImpulse(
        impulse.x,
        impulse.y,
        impulse.z
      );
    });

    platformAdapter.onReleaseButton((value) => {
      this.commands.delete(value);
    });
  }

  private handleMouseRotate(): void {
    const delta = new THREE.Vector2()
      .subVectors(this.mouseCurr, this.mousePrev)
      .multiplyScalar(0.002);

    this.velocity.set(-delta.x, delta.y);
  }

  private updateCamera(): void {
    this.yaw += this.velocity.x;
    this.pitch += this.velocity.y;

    this.pitch = Math.max(
      -Math.PI / 2 + 0.01,
      Math.min(Math.PI / 2 - 0.01, this.pitch)
    );

    this.velocity.set(0, 0);

    const rotationMatrix = new THREE.Matrix4();
    const pitchMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationY(this.yaw);
    pitchMatrix.makeRotationX(this.pitch);
    rotationMatrix.multiply(pitchMatrix);

    this.camera.quaternion.setFromRotationMatrix(rotationMatrix);
    this.camera.position.copy(this.target);

    this.camera.lookAt(
      this.target
        .clone()
        .add(new THREE.Vector3(0, 0, -1).applyMatrix4(rotationMatrix))
    );
  }

  private getCameraAxes(): {
    cameraZAxis: THREE.Vector3;
    cameraXAxis: THREE.Vector3;
    cameraYAxis: THREE.Vector3;
  } {
    const cameraZAxis = new THREE.Vector3(0, 0, -1);
    const cameraXAxis = new THREE.Vector3(1, 0, 0);
    const cameraYAxis = new THREE.Vector3(0, 1, 0);

    cameraZAxis.applyQuaternion(this.camera.quaternion);
    cameraXAxis.applyQuaternion(this.camera.quaternion);
    cameraYAxis.applyQuaternion(this.camera.quaternion);

    return { cameraZAxis, cameraXAxis, cameraYAxis };
  }
}
