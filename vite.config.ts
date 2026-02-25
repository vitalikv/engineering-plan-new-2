import { defineConfig } from 'vite'

export default defineConfig({
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
