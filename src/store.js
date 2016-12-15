import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    updatingItem: [],
    isUpdate: false,
    isLogin: false
  },
  mutations: {
    setUpdatingItem (state, value) {
      state.updatingItem = value
    },
    setIsUpdate(state, value) {
      state.isUpdate = value
    },
    setIsLogin(state, value) {
      state.isLogin = value
    }
  }
})
