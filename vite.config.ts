import MillionLint from '@million/lint';
import UnheadVite from '@unhead/addons/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';
import tsconfigPaths from 'vite-tsconfig-paths';

import path from 'path';

var plugins = [
  react(),
  tsconfigPaths(),
  wasm(),
  nodePolyfills({
    include: ['buffer'],
  }),
  topLevelAwait(),
  UnheadVite(),
  ViteImageOptimizer(),
];
plugins.unshift(MillionLint.vite());
export default defineConfig({
  base: '',
  plugins: plugins,
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
