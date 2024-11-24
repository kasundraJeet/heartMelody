// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      API_KEY: process.env.API_KEY,
      LAST_FM_BASE_URL: process.env.LAST_FM_BASE_URL,
      LAST_FM_API_KEY: process.env.LAST_FM_API_KEY,
    }
  },
  css: ['~/assets/css/style.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
  ],
})