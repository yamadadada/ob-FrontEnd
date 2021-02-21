import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import Home from './components/Home.vue'
import Game from './components/Game.vue'
import GameDetail from './components/GameDetail.vue'
import Bili from './components/Bili.vue'
import echarts from 'echarts'
import axios from 'axios'
import global from './components/common.vue'
import Log from './components/Log.vue'
import Tools from './components/Tools.vue'
import AddFDGVideo from './components/AddFDGVideo.vue'
import Fund from './components/Fund.vue'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home},
  { path: '/game', component: Game},
  { path: '/game/:gid', component: GameDetail},
  { path: '/bili', component: Bili},
  { path: '/log', component: Log},
  { path: '/tools', component: Tools},
  { path: '/addfdgvideo', component: AddFDGVideo},
  { path: '/fund', component: Fund}
]

const router = new VueRouter({
  routes
})

Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
Vue.prototype.COMMON = global

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
