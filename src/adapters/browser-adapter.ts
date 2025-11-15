import { PlatformAdapter } from "../types/platform-adapter";

export class BrowserAdapter implements PlatformAdapter {
  private resizeObserver: ResizeObserver | null = null;
  private resizeCallbacks: Set<() => void> = new Set();

  createCanvas(): HTMLCanvasElement {
    return document.createElement("canvas");
  }

  getWidth(): number {
    return Math.max(window.innerWidth, 400); // мин. ширина 400px
  }

  getHeight(): number {
    return Math.max(window.innerHeight, 300); // мин. высота 300px
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

  requestAnimationFrame(callback: FrameRequestCallback): void {
    window.requestAnimationFrame(callback);
  }
}
