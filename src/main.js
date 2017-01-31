// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {router} from './router'
import store from './store'
import App from './App'
import ApiSync from './services/api-sync'

//
// Bootstrap Axios
//
var axiosSettings = {}
if (store.getters.getSelectedApiEndpoint) {
    axiosSettings.baseURL = store.getters.getSelectedApiEndpoint.url
    axiosSettings.headers = {common: {'Authorization': 'JWT ' + store.getters.getSelectedApiEndpoint.token}}
}
Vue.use(VueAxios, axios.create(axiosSettings))
Vue.use(ApiSync)

/* eslint-disable no-new */
const app = new Vue({
    router,
    store,
    ...App
})
app.$mount('#app')

