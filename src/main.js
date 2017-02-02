// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {router} from './router'
import store from './store'
import App from './App'
import ApiSync from './services/api-sync'
// import MenuItem from './models/MenuItem'
// import lazyLoading from './router/lazyLoading'

// function generateRoutesFromVueX (menu = [], routes = []) {
//     for (let i = 0, l = menu.length; i < l; i++) {
//         let item = menu[i]
//         if (item.path) {
//             routes.push(item)
//         }
//         if (!item.component && item.children.length > 0) {
//             generateRoutesFromVueX(item.children, routes)
//         }
//     }
//     return routes
// }

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

// let defaultRoutes = [
//     new MenuItem({name: 'Projects', path: '/', component: lazyLoading('Projects')}),
//     ...generateRoutesFromVueX(store.getters.getMenuItems),
//     {name: 'Install', path: '/install', component: lazyLoading('Install')},
//     {path: '*', redirect: { name: 'Projects' }}
// ]

// router.addRoutes(defaultRoutes)

/* eslint-disable no-new */
const app = new Vue({
    router,
    store,
    ...App
})
app.$mount('#app')

