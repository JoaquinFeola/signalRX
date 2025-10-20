import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url'
import path from 'path';
import dts from "vite-plugin-dts";
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      outDir: path.resolve(__dirname, 'dist'),
      entryRoot: path.resolve(__dirname, 'src'),
      tsconfigPath: "./tsconfig.app.json"
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'signalJS',
      formats: ["es", "cjs"],
      fileName: "main"
    },
    rollupOptions: {
      external: ["vite"]
    }
  },
  resolve: {
    alias: {
      "@": path.join(__dirname, "src")
    }
  }
})
