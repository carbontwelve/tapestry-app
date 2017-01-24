// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {router} from './router/index'
import App from './App'

Vue.use(VueAxios, axios.create({
  baseURL: 'http://127.0.0.1:8000/'
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
}))

/* eslint-disable no-new */
const app = new Vue({
  router,
  ...App
})

app.$mount('#app')
