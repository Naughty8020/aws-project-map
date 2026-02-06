import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // 1. ルータープラグイン（reactの前に配置）
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    // 2. CSS/フレームワークプラグイン
    tailwindcss(),
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // Docker環境やネットワークマウント先での編集を検知
    }
  }
})
