import * as THREE from "three";
import { ITextureManager } from "./interfaces";

export class TextureManager implements ITextureManager {
  private textureLoader: THREE.TextureLoader;
  private cache: Map<string, THREE.Texture> = new Map();

  constructor() {
    this.textureLoader = new THREE.TextureLoader();
  }

  loadTexture(path: string): THREE.Texture {
    if (this.cache.has(path)) {
      return this.cache.get(path)!;
    }

    const texture = this.textureLoader.load(
      `src/textures/${path}`,
      () => console.log(`Текстура загружена: ${path}`),
      undefined,
      (error) => console.error(`Ошибка загрузки текстуры: ${path}`, error)
    );

    texture.anisotropy = 7;
    this.cache.set(path, texture);

    return texture;
  }
}
