import Vue from 'vue'
import VueScan from 'vue-scan/src'
import App from './App.vue'

import './assets/main.css'

Vue.use(VueScan)

new Vue({
  render: h => h(App),
}).$mount('#app')
