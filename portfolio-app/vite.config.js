import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Expose the app to other devices on the network
    port: 3000,        // Port number for the app (you can change this if needed)
    open: true,        // Automatically open the app in your default browser
    hmr: {
      host: 'localhost',  // Hot module replacement setup (optional)
      port: 3000,
    },
  },
})
