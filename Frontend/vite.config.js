import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Configuración moderna para Tailwind CSS v4 nativo en Vite
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Esto inicializa e inyecta automáticamente Tailwind en tu proyecto
  ],
  define: {
    'process.env': {} // Evita errores de variables de entorno heredadas de librerías viejas
  }
})