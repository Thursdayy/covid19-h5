import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存放省市数据
    provice: [],
    // 存放各国的疫情数据
    international: ''
  },
  mutations: {
    addProvice (state, provice) {
      state.provice.push(provice)
    },
    addInternational (state, international) {
      state.international = international
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getProvice: (state) => {
      return state.provice
    },
    getInternational: (state) => {
      return state.international
    }
  }
})
