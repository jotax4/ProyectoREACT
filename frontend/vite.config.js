import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/*
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
*/


// https://vitejs.dev
// defineConfig: Macro de configuración nativa de Vite para habilitar tipados y autocompletado inteligente
export default defineConfig({
  plugins: [
    react() // Habilita el soporte oficial de React (JSX, Fast Refresh) durante el desarrollo y compilación
  ],
  test: {
    globals: true, // Permite usaar métodos de testing (describe, it, expect, vi) globalmente sin importarlos en cada archivo
    environment: 'jsdom', // Configura el entorno simulado de navegador (DOM de Node.js) indispensable para Testing Library
    setupFiles: './src/setupTests.js',  // Define la ruta del archivo que inicializa y extiende configuraciones globales de testing
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/components/**', 'src/services/**'],
    },
  },
});

