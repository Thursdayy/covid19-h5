import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vant from 'vant'
import 'vant/lib/index.css'

Vue.use(vant)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
