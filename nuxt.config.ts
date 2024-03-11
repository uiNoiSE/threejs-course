import postCssPxToRem from 'postcss-pxtorem';

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@tresjs/nuxt'],
  css: ['~/assets/styles/main.less'],
  $production: {
    app: {
      baseURL: '/threejs-course',
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
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
});
