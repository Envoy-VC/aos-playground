import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import UnheadVite from '@unhead/addons/vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { comlink } from 'vite-plugin-comlink';
import wasm from 'vite-plugin-wasm';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

import topLevelAwait from 'vite-plugin-top-level-await';

import path from 'path';

export default defineConfig({
  base: '',
  plugins: [
    nodePolyfills({ include: ['buffer'] }),
    react(),
    wasm(),
    topLevelAwait(),
    tsconfigPaths(),
    comlink(),
    UnheadVite(),
    ViteImageOptimizer(),
  ],
  worker: {
    plugins: () => [comlink()],
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      $: path.resolve(__dirname, './public'),
    },
  },
});
