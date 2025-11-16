export interface PlatformAdapter {
  createCanvas(): HTMLCanvasElement;
  getWidth(): number;
  getHeight(): number;
  getPixelRatio(): number;
  onResize(callback: () => void): void;
  offResize(callback: () => void): void;
  appendToDom(element: HTMLElement): void;
  appendCanvasToDom(): void;
  requestAnimationFrame(callback: FrameRequestCallback): void;
}
