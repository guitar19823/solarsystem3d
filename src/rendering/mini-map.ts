import { Vector3D } from "../physics/vector-3d";
import {
  CanvasName,
  Command,
  PlatformAdapter,
} from "../adapters/platform-adapter";
import { CelestialBody } from "../entities/celestial-body";

export class MiniMap {
  private container: HTMLCanvasElement | undefined;
  private context: CanvasRenderingContext2D;
  private width: number = 200;
  private height: number = 200;
  private centerX: number;
  private centerY: number;
  private zoomCount: number = 2;

  private zoomMap = new Map([
    [0, 0.00000000149],
    [1, 0.0000000008],
    [2, 0.00000000058],
    [3, 0.00000000038],
    [4, 0.000000000111],
    [5, 0.0000000000603],
    [6, 0.0000000000302],
    [7, 0.0000000000192],
  ]);

  constructor(private platformAdapter: PlatformAdapter) {
    this.container = platformAdapter.getCanvas(CanvasName.MINI_MAP);

    this.container.width = this.width;
    this.container.height = this.height;
    this.context = this.container.getContext("2d")!;

    this.centerX = this.width / 2;
    this.centerY = this.height / 2;

    this.setupEvents(platformAdapter);
  }

  public init(): void {
    this.platformAdapter.appendToDom(this.container);
  }

  public render(objects: CelestialBody | undefined): void {
    if (!objects?.children) return;

    this.clear();
    this.drawOrbits(objects.children);
    this.drawObjects(objects.children);
  }

  private setupEvents(platformAdapter: PlatformAdapter): void {
    platformAdapter.onPress(() => {
      this.zoomCount += 1;
    }, CanvasName.MINI_MAP);

    platformAdapter.onPressButton((value) => {
      if (value === Command.zoomMap) {
        this.zoomCount += 1;
      }
    });
  }

  private clear(): void {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  private drawOrbits(objects: CelestialBody[]): void {
    const sunPos = objects.find((o) => o.name === "Sun")?.pos || new Vector3D();

    objects.forEach((obj) => {
      if (obj.name === "Sun" || obj.name === "Camera") return;

      const dx = obj.pos.x - sunPos.x;
      const dz = obj.pos.z - sunPos.z;
      const scale = this.zoomMap.get(this.zoomCount % 8) || 0;
      const radius = Math.sqrt(dx * dx + dz * dz) * scale;

      this.context.beginPath();
      this.context.ellipse(
        this.centerX,
        this.centerY,
        radius,
        radius,
        0,
        0,
        2 * Math.PI
      );
      this.context.strokeStyle = "rgba(255, 255, 255, 0.2)";
      this.context.lineWidth = 0.5;
      this.context.stroke();
    });
  }

  private drawObjects(objects: CelestialBody[]): void {
    const sunPos = objects.find((o) => o.name === "Sun")?.pos || new Vector3D();

    objects.forEach((obj) => {
      const dx = obj.pos.x - sunPos.x;
      const dz = obj.pos.z - sunPos.z;

      const scale = this.zoomMap.get(this.zoomCount % 8) || 0;
      const x = this.centerX + dx * scale;
      const y = this.centerY + dz * scale;

      const size = Math.max(2, obj.radius * scale);

      this.context.beginPath();
      this.context.arc(x, y, size, 0, 2 * Math.PI);
      this.context.fillStyle = obj.color;
      this.context.fill();

      this.context.font = "8px sans-serif";
      this.context.fillStyle = "white";
      this.context.textAlign = "center";

      const firstChildren = obj.children?.[0];

      if (firstChildren) {
        this.context.fillText(firstChildren.name, x, y + size + 10);
      } else {
        this.context.fillText(obj.name, x, y + size + 10);
      }
    });
  }
}
