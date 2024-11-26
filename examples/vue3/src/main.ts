import { createApp } from 'vue'
import VueScan from 'vue-scan/src'

import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
app.use(VueScan)
app.mount('#app')