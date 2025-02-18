import postCssPxToRem from 'postcss-pxtorem';

export default defineNuxtConfig({
  modules: ['@vueuse/nuxt'],
  devtools: {
    enabled: false,
    telemetry: false,
  },
  css: ['~/assets/styles/main.less'],
  $production: {
    app: {
      baseURL: '/threejs-course/',
      buildAssetsDir: 'dist',
    },
    features: {
      inlineStyles: false,
    },
    runtimeConfig: {
      public: {
        siteUrl: 'https://uinoise.github.io/threejs-course/',
      },
    },
  },
  $development: {
    app: {
      baseURL: '/',
      buildAssetsDir: 'dist',
    },
    runtimeConfig: {
      public: {
        siteUrl: '/',
      },
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
