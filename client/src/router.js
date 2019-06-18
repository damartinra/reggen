import Vue from 'vue'
import 'bootswatch/dist/superhero/bootstrap.min.css'

import Router from 'vue-router'
import Home from './views/Home.vue'
import Signup from './views/Signup.vue'
import Login from './views/Login.vue'
import Profile from './views/Profile.vue'
import Generator from './views/Generator.vue'
import Registers from './views/Registers.vue'
import Admin from './views/Admin.vue'
import store from './store.js'

Vue.use(Router)

//Redirect logged
function loggedRedirectProfile(to, from, next) {
  if(localStorage.token) {
    next('/profile')
  } else {
    next()
  }
}

//Is logged
function isLogged(to, from, next) {
  if(localStorage.token) {
    next()
  } else {
    next('/login')
  }
}

//Is admin
function isAdmin(to, from, next) {
  if(localStorage.token && store.state.role == 'admin') {
    next()
  } else {
    next('/profile')
  }
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      beforeEnter: loggedRedirectProfile
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: loggedRedirectProfile
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      beforeEnter: isLogged
    },
    {
      path: '/generator',
      name: 'generator',
      component: Generator
    },
    {
      path: '/registers',
      name: 'registers',
      component: Registers,
      beforeEnter: isLogged
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      beforeEnter: isAdmin
    },
  ]
})
