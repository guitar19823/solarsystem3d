import { CanvasName, Command, PlatformAdapter } from "./platform-adapter";

export class BrowserAdapter implements PlatformAdapter {
  private resizeCallbacks: Set<() => void> = new Set();
  private canvasList = new Map<string, HTMLCanvasElement>();

  private keyList = new Map<string, Command>([
    ["KeyW", Command.forward],
    ["KeyS", Command.back],
    ["KeyA", Command.left],
    ["KeyD", Command.right],
    ["KeyQ", Command.up],
    ["KeyE", Command.down],
    ["KeyM", Command.zoomMap],
  ]);

  constructor() {
    this.createCanvas(CanvasName.MAIN_SCENE);
  }

  getCanvas(canvasName: CanvasName) {
    const canvas = this.canvasList.get(canvasName);

    if (canvas) {
      return canvas;
    }

    return this.createCanvas(canvasName);
  }

  getCanvasWithoutAddToDom() {
    return document.createElement("canvas");
  }

  getWidth(): number {
    return Math.max(window.innerWidth, 400);
  }

  getHeight(): number {
    return Math.max(window.innerHeight, 300);
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

  appendToDom(element: HTMLElement | undefined): void {
    if (element) {
      document.body.appendChild(element);
    }
  }

  requestAnimationFrame(callback: FrameRequestCallback): void {
    window.requestAnimationFrame(callback);
  }

  onPressButton(callback: (value: string) => void): void {
    window.addEventListener("keydown", (e) => {
      const command = this.keyList.get(e.code);
      if (command) callback(command);
    });
  }

  onReleaseButton(callback: (value: string) => void): void {
    window.addEventListener("keyup", (e) => {
      const command = this.keyList.get(e.code);
      if (command) callback(command);
    });
  }

  onZoom(callback: (value: number) => void, canvasName: CanvasName): void {
    this.canvasList.get(canvasName)?.addEventListener("wheel", (e) => {
      callback(e.deltaY);
    });
  }

  onMove(
    callback: (x: number, y: number) => void,
    canvasName: CanvasName
  ): void {
    this.canvasList.get(canvasName)?.addEventListener("mousemove", (e) => {
      callback(e.clientX, e.clientY);
    });
  }

  onPress(
    callback: (x: number, y: number) => void,
    canvasName: CanvasName
  ): void {
    this.canvasList.get(canvasName)?.addEventListener("mousedown", (e) => {
      callback(e.clientX, e.clientY);
    });
  }

  onRelease(
    callback: (x: number, y: number) => void,
    canvasName: CanvasName
  ): void {
    this.canvasList.get(canvasName)?.addEventListener("mouseup", (e) => {
      callback(e.clientX, e.clientY);
    });
  }

  onLeave(
    callback: (x: number, y: number) => void,
    canvasName: CanvasName
  ): void {
    this.canvasList.get(canvasName)?.addEventListener("mouseleave", (e) => {
      callback(e.clientX, e.clientY);
    });
  }

  private createCanvas(canvasName: CanvasName) {
    const canvas = document.createElement("canvas");
    canvas.id = canvasName;

    this.canvasList.set(canvasName, canvas);
    document.body.appendChild(canvas);

    return canvas;
  }
}
