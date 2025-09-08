import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/n8n-webhook': {
        target: 'https://n8n.srv778298.hstgr.cloud/webhook/fb09047a-1a80-44e7-833a-99fe0eda3266',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/n8n-webhook/, '')
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
