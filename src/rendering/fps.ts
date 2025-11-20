import { PlatformAdapter } from "../adapters/platform-adapter";

export class FPS {
  private fpsElement: HTMLElement | null = null;

  constructor(private platformAdapter: PlatformAdapter) {}

  public init() {
    this.fpsElement = document.createElement("div");
    this.fpsElement.style.position = "absolute";
    this.fpsElement.style.top = "10px";
    this.fpsElement.style.right = "10px";
    this.fpsElement.style.color = "lime";

    document.body.appendChild(this.fpsElement);
  }

  public render(deltaTime: number) {
    if (this.fpsElement) {
      const fps = 1000 / deltaTime;
      this.fpsElement.textContent = `FPS: ${Math.floor(fps)}`;
    }
  }
}