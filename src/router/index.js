import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const PassThrough = {
    name: 'PassThrough',
    template: '<router-view></router-view>'
}

import lazyLoading from './lazyLoading'
import store from '../store'

export var router = new Router({
    mode: 'history',
    linkActiveClass: 'is-active',
    routes: [
        {name: 'Install', path: '/install', component: lazyLoading('Install')},
        {
            path: '/',
            component: PassThrough,
            meta: {ignore: true},
            children: [
                {name: 'Projects', path: '', component: lazyLoading('Projects'), meta: {label: 'All Projects'}},
                {name: 'InitProject', path: 'initiate', component: lazyLoading('InitiateProject'), meta: {label: 'Initiate New Project'}}
            ]
        },
        {name: 'Dashboard', path: '/dashboard', component: lazyLoading('Dashboard')},
        {
            name: 'ContentType',
            path: '/content-type/:contentType/',
            component: PassThrough,
            meta: {label: ':contentType'},
            children: [
                {name: 'ContentTypeContent', path: 'content', component: lazyLoading('ContentTypeContent'), meta: {label: ':contentType Content'}},
                {name: 'ContentTypeTaxonomy', path: 'taxonomy/:taxonomy', component: lazyLoading('Dashboard'), meta: {label: ':contentType :taxonomy'}}
            ]
        },
        {name: 'Uploads', path: '/uploads', component: lazyLoading('Dashboard')},
        {name: 'FileExplorer', path: '/file-explorer', component: lazyLoading('Dashboard')},
        {name: 'Configuration', path: '/configuration', component: lazyLoading('Dashboard')},
        {path: '*', redirect: { name: 'Projects' }}
    ]
})

// Authentication Service
import Auth from '../services/auth'
router.beforeEach((to, from, next) => {
    // If the user is not yet installed, redirect to the installer
    if (!store.getters.isInstalled && to.name !== 'Install') {
        return next('/install')
    }

    // If the user is attempting to visit the installer, and we are already installed, redirect to Projects page
    if (store.getters.isInstalled && to.name === 'Install') {
        return next('/')
    }

    // Until the user has a selected project limit them to only accessing the Projects page
    if (store.getters.isInstalled && !store.getters.hasSelectedProject && to.name !== 'Projects') {
        return next('/')
    }

    // Else continue
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
