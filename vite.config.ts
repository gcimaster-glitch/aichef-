import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    build({
      exclude: ['/static/*', '/images/*', '/landing.html']
    }),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: false // Don't delete public files
  }
})
