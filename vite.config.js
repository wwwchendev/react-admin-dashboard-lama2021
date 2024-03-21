/* eslint-disable no-unused-vars */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  const env = loadEnv(mode, process.cwd())
  console.log({
    '當前運行環境': mode,
    '根目錄': env.VITE_BASENAME //根據mode輸出環境變數
  });

  return {
    base: env.VITE_BASENAME,
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    // sourcemap: 開發環境預設啟用生產版本不啟用，如果需要啟用設置如下。
    // build: {
    //   sourcemap: true, 
    // },
  }
});