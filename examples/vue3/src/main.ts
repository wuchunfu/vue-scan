import { createApp } from 'vue'
import VueScan, { type VueScanOptions } from 'z-vue-scan/src'

import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
app.use<VueScanOptions>(VueScan, {})
app.mount('#app')
