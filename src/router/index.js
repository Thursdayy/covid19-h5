import Vue from 'vue'
import VueRouter from 'vue-router'
import domestic from './../views/domestic.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/domestic'
  },
  {
    path: '/domestic',
    name: 'domestic',
    component: domestic
  },
  {
    path: '/foreign',
    name: 'foreign',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/foreign.vue')
  },
  {
    path: '/local',
    name: 'local',
    component: () => import('../views/local.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
