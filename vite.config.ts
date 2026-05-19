/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Digital Cow',
        short_name: 'DigitalCow',
        description: 'Gestion ganadera multi-tenant',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        // Para SPAs: servir index.html cuando la navegación no esta cacheada
        // (rutas profundas como /hacer-nota/celo abiertas offline).
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        // No precachear imágenes y datos que crecen sin límite.
        globPatterns: ['**/*.{js,css,html,svg,ico,woff,woff2}'],
        runtimeCaching: [
          // Catálogos: cambian poco, son base para todos los wizards.
          {
            urlPattern: ({ url }) => /\/api\/v1\/(breeds|catalog\/(diseases|medications|vaccines))/.test(url.pathname),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'catalog-cache', expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          },
          // Datos del rancho que se consultan al abrir cada flujo.
          {
            urlPattern: ({ url }) => /\/api\/v1\/(ranches|animals|reproduction\/bulls|reproduction\/semen-straws|feeding\/items|finance\/categories)(\/|\?|$)/.test(url.pathname + url.search),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'ranch-data-cache', expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 7 } }
          },
          // Listas de eventos (ordeños, pesajes, salud, repro, etc.) que se ven en pantallas de panel.
          {
            urlPattern: ({ url }) => /\/api\/v1\/(production|health|reproduction|feeding|finance)\//.test(url.pathname),
            method: 'GET',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'events-cache', expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 3 } }
          },
          // Fotos de animales (URLs presignadas o /uploads).
          {
            urlPattern: ({ url, request }) => request.destination === 'image' && (/\/uploads\//.test(url.pathname) || /\/api\/v1\/.*\/photo/.test(url.pathname)),
            handler: 'CacheFirst',
            options: { cacheName: 'animal-photos', expiration: { maxEntries: 1000, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          },
          // Mutaciones (POST/PATCH/DELETE): si no hay red, las pone en cola y
          // las reenvía sola cuando vuelve la conexión (Background Sync API).
          {
            urlPattern: /\/api\/v1\//,
            method: 'POST',
            handler: 'NetworkOnly',
            options: { backgroundSync: { name: 'mutations-queue', options: { maxRetentionTime: 60 * 24 } } }
          },
          {
            urlPattern: /\/api\/v1\//,
            method: 'PATCH',
            handler: 'NetworkOnly',
            options: { backgroundSync: { name: 'mutations-queue', options: { maxRetentionTime: 60 * 24 } } }
          },
          {
            urlPattern: /\/api\/v1\//,
            method: 'PUT',
            handler: 'NetworkOnly',
            options: { backgroundSync: { name: 'mutations-queue', options: { maxRetentionTime: 60 * 24 } } }
          },
          {
            urlPattern: /\/api\/v1\//,
            method: 'DELETE',
            handler: 'NetworkOnly',
            options: { backgroundSync: { name: 'mutations-queue', options: { maxRetentionTime: 60 * 24 } } }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  server: {
    port: 5173,
    proxy: {
      // Redirige cualquier peticion /api hacia el backend Spring Boot en dev.
      // En produccion el frontend se sirve desde nginx con un proxy equivalente.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
});
