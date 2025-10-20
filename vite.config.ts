import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import path from "path";
import dts from "vite-plugin-dts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "SignalRX",
      formats: ["es"],         
      fileName: "index"
    },
    rollupOptions: {
      external: ["vite"],      
    }
  },
  plugins: [
    dts({
      rollupTypes: true,                        
      entryRoot: path.resolve(__dirname, "src"),
      outDir: path.resolve(__dirname, "dist"),
      insertTypesEntry: true,
      tsconfigPath: path.resolve(__dirname, "tsconfig.app.json")
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});
