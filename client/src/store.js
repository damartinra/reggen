import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  state: {
    user: '',
    role: '',
    token: null,
    isUserLoggedIn: false
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setRole(state, role) {
      state.role = role
    },
    setToken(state, token) {
      state.token = token
      if(token) {
          state.isUserLoggedIn = true
      } else {
          state.isUserLoggedIn = false
      }
    }
  },
  actions: {
    setUser({commit}, user) {
      commit('setUser', user)
    },
    setToken({commit}, token) {
      commit('setToken', token)
    },
    setRole({commit}, role) {
      commit('setRole', role)
    }
  },
  plugins: [vuexLocal.plugin]
})