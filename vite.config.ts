import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // нужен для работы в Electron (относительные пути)
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
