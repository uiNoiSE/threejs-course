import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import postCssPxToRem from 'postcss-pxtorem';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [vue(), postCssPxToRem()],
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          propList: [
            '*',
            '!border-left',
            '!border-right',
            '!border-top',
            '!border-bottom',
            '!border',
            '!outline',
          ],
        }),
      ],
    },
    preprocessorOptions: {
      less: {
        additionalData: `@import '@/assets/styles/main';`,
      },
    },
  },
});
