import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Hello from '../components/Hello'
import Login from '../components/MyComponent'
import lazyLoading from './lazyLoading'

export var router = new Router({
    mode: 'history',
    routes: [
        {name: 'Home', path: '/', component: lazyLoading('Install')}, // , meta: {requiresAuth: true}},
        {name: 'Dashboard', path: '/dashboard', component: lazyLoading('Dashboard')}, // , meta: {requiresAuth: true}},
        {path: '/site', component: Hello},
        {path: '/login', component: Login},
        {path: '*', redirect: { name: 'Home' }}
    ]
})

// Authentication Service
import Auth from '../services/auth'
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !Auth.authenticated) {
        return next('/login')
    }
    return next()
})

Vue.extend({
    data: function () {
        return {user: {}}
    },
    computed: {
        auth: function () {
            return Auth
        }
    },
    methods: {
        checkLocalStorage: function () {
            if (window.localStorage.user) {
                this.user = JSON.parse(window.localStorage.user)
                Vue.http.headers.common['Authorization'] = 'Bearer ' + this.user.api_token
                Auth.authenticated = true
            }
        },
        logout: function () {
            this.user = {}
            Auth.logout()
        }
    },
    ready: function () {
        this.checkLocalStorage()
    }
})
