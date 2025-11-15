import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist", // куда складывать сборку
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true, // автоматически откроет браузер
  },
});
