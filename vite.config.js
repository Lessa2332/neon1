import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'mediapipe': ['@mediapipe/tasks-vision']
        }
      }
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SmartLessa AR',
        short_name: 'SmartLessa',
        start_url: './index.html',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#00ffaa',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        runtimeCaching: [{
          urlPattern: /\.(mp4|png|jpg|webm)$/i,
          handler: 'CacheFirst',
          options: { cacheName: 'assets-cache', expiration: { maxEntries: 50, maxAgeSeconds: 2592000 }}
        }]
      }
    })
  ]
});
