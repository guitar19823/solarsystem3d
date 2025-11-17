export interface PlatformAdapter {
  getMainCanvas(): HTMLCanvasElement | undefined;
  getCanvas(): HTMLCanvasElement | undefined;
  getWidth(): number;
  getHeight(): number;
  getPixelRatio(): number;
  onResize(callback: () => void): void;
  offResize(callback: () => void): void;
  appendToDom(element: HTMLElement): void;
  appendCanvasToDom(): void;
  requestAnimationFrame(callback: FrameRequestCallback): void;
  onZoom(callback: (value: number) => void): void;
  onPress(callback: (value: string) => void): void;
  onRelease(callback: (value: string) => void): void;
  onMove(callback: (x: number, y: number) => void): void;
  onMoveStart(callback: (x: number, y: number) => void): void;
  onMoveEnd(callback: (x: number, y: number) => void): void;
  onLeave(callback: (x: number, y: number) => void): void;
}
