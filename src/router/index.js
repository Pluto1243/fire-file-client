import Vue from 'vue'
import Router from 'vue-router'
import Main from "../views/Main"
import Share from "../views/Share";
import Index from "../views/Index"

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/main',
      name: 'Main',
      component: Main
    },
    {
      path: '/s/:key',
      name: 'share',
      component: Share
    }
  ]
})
