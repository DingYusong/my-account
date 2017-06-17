import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes:[
    { path: '/', redirect: '/index/home' },
    { path: '/index', component: resolve => require(['./components/index.vue'], resolve),
      children:[
        { path: 'home', component: resolve => require(['./components/home.vue'], resolve) },
        { path: 'income', component: resolve => require(['./components/income.vue'], resolve) },
        { path: 'expend', component: resolve => require(['./components/expend.vue'], resolve) },
        { path: 'account', component: resolve => require(['./components/account.vue'], resolve) }

      ]
    }
  ]





})
