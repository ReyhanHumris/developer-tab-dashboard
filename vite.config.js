import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      // Chrome Extension fix: strip 'crossorigin' attribute Vite injects.
      // chrome-extension:// pages reject crossorigin on local assets → blank screen.
      name: 'strip-crossorigin',
      apply: 'build',
      transformIndexHtml(html) {
        return html
          .replace(/ crossorigin=""/g, '')
          .replace(/ crossorigin/g, '');
      }
    },
    {
      name: 'copy-extension-manifest',
      apply: 'build',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          source: readFileSync(new URL('./manifest.json', import.meta.url), 'utf8')
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Inline small assets to avoid crossorigin issues with extension sandbox
    assetsInlineLimit: 0
  }
});
