/* demo.html */

import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'

import App from './demo'

Vue.use(ElementUI, { size: 'medium' })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App),
})
