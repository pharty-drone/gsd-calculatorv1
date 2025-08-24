import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import javascriptObfuscator from 'vite-plugin-javascript-obfuscator';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/gsd-calculatorv1/' : '/',
  plugins: [
    react(),
    mode === 'production' &&
      javascriptObfuscator({
        compact: true,
        controlFlowFlattening: true,
        stringArray: true,
        stringArrayRotate: true,
        deadCodeInjection: false,
        target: 'browser',
      }),
  ].filter(Boolean),
}));
