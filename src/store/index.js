import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null,
    token: '',
  },
  mutations: {
    setUserInfo(state, payload) {
      state.userInfo = payload.user;
      state.token = payload.token;
    },
    clearUserInfo(state) {
      state.userInfo = null;
      state.token = '';
    },
    setOnlyUserInfoByTopic(state, user) {
      state.userInfo = user
    },
  },
  actions: {
  },
  modules: {
  }
})
