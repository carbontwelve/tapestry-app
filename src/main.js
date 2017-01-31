// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {router} from './router'
import store from './store'
import App from './App'

//
// Bootstrap Axios
//
var axiosSettings = {}
if (store.getters.getSelectedApiEndpoint) {
    axiosSettings.baseURL = store.getters.getSelectedApiEndpoint.url
    axiosSettings.headers = {common: {'Authorization': 'JWT ' + store.getters.getSelectedApiEndpoint.token}}
}
Vue.use(VueAxios, axios.create(axiosSettings))

/* eslint-disable no-new */
const app = new Vue({
    router,
    store,
    ...App
})

//
// Check if we have any sites installed
//

if (store.getters.totalApiEndpoints === 0) {
    store.dispatch('setInstalled', false)
}

app.$mount('#app')
