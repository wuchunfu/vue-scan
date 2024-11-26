import Vue from 'vue'
import VueScan from 'vue-scan/src/index_vue2'
import App from './App.vue'

import './assets/main.css'

Vue.use(VueScan)

new Vue({
  render: h => h(App),
}).$mount('#app')
