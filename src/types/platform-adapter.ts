export interface PlatformAdapter {
  createCanvas(): HTMLCanvasElement;
  getWidth(): number;
  getHeight(): number;
  onResize(callback: () => void): void;
  offResize(callback: () => void): void;
  appendToDom(element: HTMLElement): void;
  requestAnimationFrame(callback: FrameRequestCallback): void;
}
