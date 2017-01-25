import Vue from 'vue'
import Vuex from 'vuex'
import {modules, actions, getters, types} from './modules/_index'
import plugins from './plugins'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    actions,
    getters,
    modules,
    types,
    plugins
})
