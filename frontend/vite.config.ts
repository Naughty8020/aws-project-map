import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // これを追加！すべてのIPからの接続を許可します
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // WindowsやLinuxのDocker環境で、ファイルの保存を即座に反映させるために必要
    }
  }
})
