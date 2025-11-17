export const enum CanvasName {
  MAIN_SCENE = "MAIN_SCENE",
  MINI_MAP = "MINI_MAP",
}

export const enum Command {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  up = "up",
  down = "down",
  zoomMap = "zoomMap",
}
export interface PlatformAdapter {
  getCanvas(canvasName: CanvasName): HTMLCanvasElement;
  getCanvasWithoutAddToDom(): HTMLCanvasElement;
  getWidth(): number;
  getHeight(): number;
  getPixelRatio(): number;
  onResize(callback: () => void): void;
  offResize(callback: () => void): void;
  appendToDom(element: HTMLElement | undefined): void;
  requestAnimationFrame(callback: FrameRequestCallback): void;

  onPressButton(callback: (value: string) => void): void;
  onReleaseButton(callback: (value: string) => void): void;
  onZoom(callback: (value: number) => void, canvasName: CanvasName): void;

  onMove(
    callback: (x: number, y: number) => void,
    canvasName: CanvasName
  ): void;

  onPress(
    callback: (x: number, y: number) => void,
    canvasName: CanvasName
  ): void;

  onRelease(
    callback: (x: number, y: number) => void,
    canvasName: CanvasName
  ): void;

  onLeave(
    callback: (x: number, y: number) => void,
    canvasName: CanvasName
  ): void;
}
