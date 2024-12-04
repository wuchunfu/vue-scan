import UnoCSS from 'unocss/vite'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    permissions: ['storage'],
    web_accessible_resources: [{
      resources: ['auto.cjs'],
      matches: ['<all_urls>'],
    }],
  },
  vite: () => {
    return {
      plugins: [
        UnoCSS(),
      ],
    }
  },
})
