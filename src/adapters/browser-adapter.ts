import { PlatformAdapter } from "./platform-adapter";

export class BrowserAdapter implements PlatformAdapter {
  private resizeCallbacks: Set<() => void> = new Set();
  private canvas: HTMLCanvasElement | undefined;

  constructor() {
    this.canvas = document.createElement("canvas");

    document.body.appendChild(this.canvas);
  }

  getCanvas(): HTMLCanvasElement | undefined {
    return this.canvas;
  }

  getWidth(): number {
    return Math.max(window.innerWidth, 400); // мин. ширина 400px
  }

  getHeight(): number {
    return Math.max(window.innerHeight, 300); // мин. высота 300px
  }

  getPixelRatio(): number {
    return window.devicePixelRatio;
  }

  onResize(callback: () => void): void {
    this.resizeCallbacks.add(callback);
    window.addEventListener("resize", callback);
  }

  offResize(callback: () => void): void {
    this.resizeCallbacks.delete(callback);
    window.removeEventListener("resize", callback);
  }

  appendToDom(element: HTMLElement): void {
    document.body.appendChild(element);
  }

  appendCanvasToDom(): void {
    if (this.canvas) {
      document.body.appendChild(this.canvas);
    }
  }

  requestAnimationFrame(callback: FrameRequestCallback): void {
    window.requestAnimationFrame(callback);
  }

  onZoom(callback: (value: number) => void): void {
    window.addEventListener("wheel", (e) => {
      callback(e.deltaY);
    });
  }

  onPress(callback: (value: string) => void): void {
    window.addEventListener("keydown", (e) => {
      if (e.code === "KeyW") callback("forward");
      if (e.code === "KeyS") callback("back");
      if (e.code === "KeyA") callback("left");
      if (e.code === "KeyD") callback("right");
      if (e.code === "KeyQ") callback("up");
      if (e.code === "KeyE") callback("down");
    });
  }

  onRelease(callback: (value: string) => void): void {
    window.addEventListener("keyup", (e) => {
      if (e.code === "KeyW") callback("forward");
      if (e.code === "KeyS") callback("back");
      if (e.code === "KeyA") callback("left");
      if (e.code === "KeyD") callback("right");
      if (e.code === "KeyQ") callback("up");
      if (e.code === "KeyE") callback("down");
    });
  }

  onMove(callback: (x: number, y: number) => void): void {
    this.canvas?.addEventListener("mousemove", (e) => {
      callback(e.clientX, e.clientY);
    });
  }

  onMoveStart(callback: (x: number, y: number) => void): void {
    this.canvas?.addEventListener("mousedown", (e) => {
      callback(e.clientX, e.clientY);
    });
  }

  onMoveEnd(callback: (x: number, y: number) => void): void {
    this.canvas?.addEventListener("mouseup", (e) => {
      callback(e.clientX, e.clientY);
    });
  }

  onLeave(callback: (x: number, y: number) => void): void {
    this.canvas?.addEventListener("mouseleave", (e) => {
      callback(e.clientX, e.clientY);
    });
  }
}
