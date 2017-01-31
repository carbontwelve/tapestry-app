import Vue from 'vue'
import Site from '../../models/api'
export var API_STORAGE_KEY = 'apis'

const types = {
    ADD_API_ENDPOINT: 'ADD_API_ENDPOINT',
    MODIFY_API_ENDPOINT: 'MODIFY_API_ENDPOINT',
    REMOVE_API_ENDPOINT: 'REMOVE_SITE',
    SET_SELECTED: 'SET_SELECTED'
}

const state = (window.localStorage.getItem(API_STORAGE_KEY) !== null) ? JSON.parse(window.localStorage.getItem(API_STORAGE_KEY)) : {
    selected: null,
    all: []
}

// Mutate the "all" state so that each item is an instance of Site
if (state.all.length > 0) {
    for (var i = 0; i <= state.all.length - 1; i++) {
        state.all[i] = new Site(state.all[i])
    }
}

const mutations = {
    [types.ADD_API_ENDPOINT] (state, data) {
        state.all.push(data)
    },
    [types.MODIFY_API_ENDPOINT] (state, {site, key, value}) {
        site[key] = value
    },
    [types.REMOVE_API_ENDPOINT] (state, site) {
        state.all.splice(state.all.indexOf(site), 1)
    },
    [types.SET_SELECTED] (state, site) {
        state.selected = site
        Vue.axios.defaults.baseURL = state.selected.url
        Vue.axios.defaults.headers.common['Authorization'] = 'JWT ' + state.selected.token
    }
}

const actions = {
    addApiEndpoint ({state, dispatch, commit}, payload) {
        commit(types.ADD_API_ENDPOINT, payload || {})

        // If this is the first site then it needs to be set as the selected site
        if (state.all.length === 1) {
            dispatch('setSelectedApiEndpoint', payload)
        }
    },
    removeApiEndpoint ({state, dispatch, commit}, payload) {
        // @todo you shouldn't be able to remove the currently selected site, or the last site in the list
        commit(types.REMOVE_API_ENDPOINT, payload || {})
    },
    setSelectedApiEndpoint ({state, dispatch, commit}, payload) {
        commit(types.SET_SELECTED, payload || null)
    }
}

const getters = {
    totalApiEndpoints: state => state.all.length,
    hasSelectedApiEndpoint: state => state.selected !== null,
    getSelectedApiEndpoint: state => state.selected,
    listApiEndpoints: state => {
        let endpoints = []
        for (var i = 0; i < state.all.length; i++) {
            endpoints.push({
                uuid: state.all[i].uuid,
                url: state.all[i].url
            })
        }
        return endpoints
    }
}

export default {state, mutations, actions, getters, types}
