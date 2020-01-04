/* bg.html */

import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import '@/lib/element-ui/theme/index.scss'

// 公共 index 掺杂了太多其他代码，一点都不公共，故不引进来
// import '@/styles/index.scss' // global css

import App from './bg'

Vue.use(ElementUI, { size: 'medium' })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App),
})
