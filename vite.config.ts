import { basename } from 'path'
import { defineConfig } from 'vite'

const domain = basename(process.cwd())

export default defineConfig({
  base: './',
  server: {
    proxy: {
      '/components': `http://${domain}`,
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        documentation: 'documentation.html',
        contact: 'contact.html',
      },
    },
  },
})
