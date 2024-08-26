import postCssPxToRem from 'postcss-pxtorem';

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/styles/main.less'],
  $production: {
    app: {
      baseURL: '/threejs-course',
      buildAssetsDir: 'dist',
    },
    features: {
      inlineStyles: false,
    },
  },
  $development: {
    app: {
      baseURL: '/',
      buildAssetsDir: 'dist',
    },
  },
  vite: {
    plugins: [
      // @ts-ignore
      postCssPxToRem(),
    ],
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
    },
    build: {
      assetsInlineLimit: 0,
    },
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
});
