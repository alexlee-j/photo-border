import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

const host = process.env.TAURI_DEV_HOST;
const port = process.env.TAURI_DEV_PORT ? parseInt(process.env.TAURI_DEV_PORT) : 1420;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@radix-ui/react-icons': '@radix-ui/react-icons',
    },
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  server: {
    host: host || '127.0.0.1',
    port: port,
    strictPort: true,
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: ['es2020'],
  },
  esbuild: {
    // Add TypeScript support
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
      },
    },
  },
}));
