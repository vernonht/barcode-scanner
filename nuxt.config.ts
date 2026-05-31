export default defineNuxtConfig({
  compatibilityDate: '2026-05-31',
  ssr: false,
  css: ['~/assets/css/tailwind.css'],
  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],
  app: {
    head: {
      title: 'barcode-scanner',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Using phone camera to capture barcode' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'barcode-scanner',
      short_name: 'barcode',
      description: 'Using phone camera to capture barcode',
      theme_color: '#35495e'
    }
  },
  vite: {
    optimizeDeps: {
      include: [
        '@ericblade/quagga2', // CJS
        '@vue/devtools-kit',
      ]
    }
  }
})
