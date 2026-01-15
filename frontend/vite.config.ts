import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
     tailwindcss(),
     react()],
  server: {
    host: '0.0.0.0', // これを追加！すべてのIPからの接続を許可します
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // WindowsやLinuxのDocker環境で、ファイルの保存を即座に反映させるために必要
    }
  }
})
