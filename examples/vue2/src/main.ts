import Vue from 'vue'
import VueScan, { type VueScanBaseOptions } from 'z-vue-scan/src/index_vue2'
import App from './App.vue'

import './assets/main.css'

Vue.use<VueScanBaseOptions>(VueScan, {})

new Vue({
  render: h => h(App),
}).$mount('#app')
