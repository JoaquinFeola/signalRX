import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: resolve(__dirname, 'dist/main.js'),
      name: 'signalJS',
      fileName: "my-lab"
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
