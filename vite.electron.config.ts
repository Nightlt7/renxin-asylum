import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Electron 打包使用相对路径，适配 file:// 协议
export default defineConfig({
  plugins: [react()],
  base: './',
})
