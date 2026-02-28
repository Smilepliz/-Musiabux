import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.GITHUB_PAGES === '1' ? '/-Musiabux/' : './', // ./ для exe, /-Musiabux/ для GitHub Pages
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
