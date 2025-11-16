import * as THREE from "three";
import { ICameraController } from "./interfaces";
import { PlatformAdapter } from "../adapters/platform-adapter";

export class CameraController implements ICameraController {
  private camera: THREE.PerspectiveCamera;

  private yaw: number = 0;
  private pitch: number = 0;

  private target: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  private damping: number = 0.25;
  private velocity: THREE.Vector2 = new THREE.Vector2(0, 0);

  private commands = new Set();
  private moveSpeed: number = 500;

  private isMouseDown: boolean = false;
  private mousePrev: THREE.Vector2 = new THREE.Vector2();
  private mouseCurr: THREE.Vector2 = new THREE.Vector2();

  constructor(platformAdapter: PlatformAdapter) {
    this.camera = new THREE.PerspectiveCamera(
      65,
      platformAdapter.getWidth() / platformAdapter.getHeight(),
      0.001,
      50000000000
    );

    this.setupEvents(platformAdapter);
    this.updateCamera();
  }

  private setupEvents(platformAdapter: PlatformAdapter): void {
    platformAdapter.onMoveStart((x, y) => {
      this.isMouseDown = true;
      this.mousePrev.set(x, y);
    });

    platformAdapter.onMoveEnd(() => {
      this.isMouseDown = false;
    });

    platformAdapter.onLeave(() => {
      this.isMouseDown = false;
    });

    platformAdapter.onMove((x, y) => {
      if (this.isMouseDown) {
        this.mouseCurr.set(x, y);
        this.handleMouseRotate();
        this.mousePrev.copy(this.mouseCurr);
      }
    });

    platformAdapter.onZoom((value) => {
      const zoomSpeed = 10;
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(this.camera.quaternion);
      this.target.addScaledVector(direction, value * 0.01 * zoomSpeed);
      this.updateCamera();
    });

    platformAdapter.onPress((value) => {
      this.commands.add(value);
    });

    platformAdapter.onRelease((value) => {
      this.commands.delete(value);
    });
  }

  update(): void {
    this.applyDamping();
    this.updateCameraPosition();
    this.updateCamera();
  }

  private applyDamping(): void {
    this.velocity.multiplyScalar(1 - this.damping);
  }

  private handleMouseRotate(): void {
    const delta = new THREE.Vector2()
      .subVectors(this.mouseCurr, this.mousePrev)
      .multiplyScalar(0.002);

    this.velocity.set(-delta.x, delta.y);
  }

  private updateCameraPosition(): void {
    if (!this.commands.size) return;

    const move = new THREE.Vector3();

    const cameraDirection = new THREE.Vector3(0, 0, -1);
    cameraDirection.applyQuaternion(this.camera.quaternion);

    const right = new THREE.Vector3(1, 0, 0);
    right.applyQuaternion(this.camera.quaternion);

    const up = new THREE.Vector3(0, 1, 0);

    let dx = 0,
      dy = 0,
      dz = 0;

    if (this.commands.has("forward")) dz += 1;
    if (this.commands.has("back")) dz -= 1;
    if (this.commands.has("left")) dx -= 1;
    if (this.commands.has("right")) dx += 1;
    if (this.commands.has("up")) dy += 1;
    if (this.commands.has("down")) dy -= 1;

    if (dx !== 0 || dy !== 0 || dz !== 0) {
      move
        .addScaledVector(right, dx)
        .addScaledVector(up, dy)
        .addScaledVector(cameraDirection, dz);

      move.multiplyScalar(this.moveSpeed * 0.0001);

      this.camera.position.add(move);
      this.target.add(move);
    }
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

  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  lookAt(target: THREE.Vector3): void {
    this.target.copy(target);
    this.updateCamera();
  }

  setPosition(position: THREE.Vector3): void {
    this.camera.position.copy(position);
    this.target.copy(position);
    this.updateCamera();
  }

  reset(): void {
    this.yaw = 0;
    this.pitch = 0;
    this.target.set(0, 0, 0);
    this.velocity.set(0, 0);
    this.updateCamera();
  }

  setEnabled(enabled: boolean): void {}

  getPosition(): THREE.Vector3 {
    return this.camera.position;
  }

  getDirection(): THREE.Vector3 {
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);

    return direction;
  }
}
