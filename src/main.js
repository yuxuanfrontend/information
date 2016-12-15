import Vue from 'vue'
import router from 'vue-router'
import VResource from 'vue-resource'
import App from './App'
import login from './components/login'
import content from './components/content'
import information from './components/information'
import articleeditors from './components/articleEditors'
import store from './store'
// import login from './components/login'

/* eslint-disable no-new */
Vue.use(router)
Vue.use(VResource)



var routers = [
  { path:'/',component:login },
  { path:'/login',component:login },
  { path:'/content',component:content ,
    children:[
      { path:'information', component:information},
      { path:'articleeditors', component:articleeditors}
    ]
  }
  // { path:'/articleeditors',component:articleeditors }
]

var route = new router({
  routes: routers // （缩写）相当于 routes: routes
})


var app = new Vue({
  el: '#app',
  router: route,
  store,
  render: c => c(App)
  // component: {
  //   App
  // }
})
