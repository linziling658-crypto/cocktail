
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 仅注入必要的 API 密钥
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});
