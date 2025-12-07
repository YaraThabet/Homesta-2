import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [react(),tailwindcss()],
=======
  plugins: [react()
  , tailwindcss()
  ],
>>>>>>> cde5d07c970a9a6636cef0e98f7ecb64cc0cde52
})
