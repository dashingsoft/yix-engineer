import Vue from 'vue'
import App from './App.vue'

import RadixInput from './components/RadixInput.vue'
import './plugins/element.js'

Vue.config.productionTip = false
Vue.component('radix-input', RadixInput)

new Vue({
  render: h => h(App),
}).$mount('#app')
