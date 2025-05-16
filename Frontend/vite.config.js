import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: true,  // This will make it accessible on the local network
    port: 3000,  // You can change the port if needed
  },
  theme: {
    extend: {
      backdropBlur: {
        sm: '4px',
      },
    },
  }
  
})
