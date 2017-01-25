import Vue from 'vue'
import Vuex from 'vuex'
import {modules, actions, getters, types} from './modules/_index'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  actions,
  getters,
  modules,
  types
})
