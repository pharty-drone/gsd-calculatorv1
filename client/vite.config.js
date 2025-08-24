import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
+  base: '/gsd-calculatorv1/',   // IMPORTANT: repo name
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:5000' },
  },
  plugins: [react()],
});
