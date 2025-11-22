export class Vector3D {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  // Арифметические операции
  add(v: Vector3D): Vector3D {
    return new Vector3D(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  subtract(v: Vector3D): Vector3D {
    return new Vector3D(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  multiply(scalar: number): Vector3D {
    return new Vector3D(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  divide(scalar: number): Vector3D {
    if (scalar === 0) throw new Error("Division by zero");
    return new Vector3D(this.x / scalar, this.y / scalar, this.z / scalar);
  }

  // Векторные операции
  dot(v: Vector3D): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vector3D): Vector3D {
    return new Vector3D(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  // Нормализация и длина
  magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  magnitudeSquared(): number {
    return this.x ** 2 + this.y ** 2 + this.z ** 2;
  }

  normalize(): Vector3D {
    const mag = this.magnitude();
    if (mag === 0) return new Vector3D();
    return this.divide(mag);
  }

  isNormalized(): boolean {
    return Math.abs(this.magnitude() - 1) < 1e-6;
  }

  // Сравнение
  equals(v: Vector3D, epsilon: number = 1e-6): boolean {
    return (
      Math.abs(this.x - v.x) < epsilon &&
      Math.abs(this.y - v.y) < epsilon &&
      Math.abs(this.z - v.z) < epsilon
    );
  }

  // Клонирование и копирование
  clone(): Vector3D {
    return new Vector3D(this.x, this.y, this.z);
  }

  copyFrom(v: Vector3D): void {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  }

  set(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // Прочие полезные методы
  negate(): Vector3D {
    return new Vector3D(-this.x, -this.y, -this.z);
  }

  lerp(v: Vector3D, t: number): Vector3D {
    return this.add(v.subtract(this).multiply(t));
  }

  distanceTo(v: Vector3D): number {
    return this.subtract(v).magnitude();
  }

  distanceSquaredTo(v: Vector3D): number {
    return this.subtract(v).magnitudeSquared();
  }

  angleTo(v: Vector3D): number {
    const dot = this.dot(v);
    const magA = this.magnitude();
    const magB = v.magnitude();
    if (magA === 0 || magB === 0) return 0;
    return Math.acos(dot / (magA * magB));
  }
}
