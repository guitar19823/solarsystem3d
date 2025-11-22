import { CanvasName, PlatformAdapter } from "../adapters/platform-adapter";

export class FPS {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor(private platformAdapter: PlatformAdapter) {
    this.canvas = this.platformAdapter.getCanvas(CanvasName.FPS);
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "10px";
    this.canvas.style.right = "10px";
    this.canvas.style.pointerEvents = "none";
    this.canvas.width = 100;
    this.canvas.height = 30;

    this.ctx = this.canvas.getContext("2d");
  }

  public init() {
    this.platformAdapter.appendToDom(this.canvas);
  }

  public render(deltaTime: number) {
    if (!this.canvas || !this.ctx) {
      return;
    }

    const fps = 1000 / deltaTime;
    const fpsText = `FPS: ${Math.floor(fps)}`;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = "14px monospace";
    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = "lime";

    this.ctx.fillText(fpsText, this.canvas.width - 5, 5);
  }
}
