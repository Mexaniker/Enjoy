import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Enjoy/',  // имя репозитория!
  plugins: [react()],
  build: {
            outDir: 'docs'
          }
});