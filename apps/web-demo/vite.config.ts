import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: [
      { find: 'behavior-library', replacement: path.resolve(__dirname, '../../packages/behavior-library/src') },
      { find: 'simulation-engine', replacement: path.resolve(__dirname, '../../packages/simulation-engine/src') },
      { find: 'ui-renderer', replacement: path.resolve(__dirname, '../../packages/ui-renderer/src') }
    ]
  },
  server: {
    open: true
  }
})