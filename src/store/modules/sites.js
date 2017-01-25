export var SITES_STORAGE_KEY = 'sites'

const types = {
    ADD_SITE: 'ADD_SITE',
    MODIFY_SITE: 'MODIFY_SITE',
    REMOVE_SITE: 'REMOVE_SITE',
    SET_SELECTED: 'SET_SELECTED'
}

const state = {
    selected: null,
    all: JSON.parse(window.localStorage.getItem(SITES_STORAGE_KEY) || '[]')
}

const mutations = {
    [types.ADD_SITE] (state, data) {
        state.all.push(data)
    },
    [types.MODIFY_SITE] (state, {site, key, value}) {
        site[key] = value
    },
    [types.REMOVE_SITE] (state, site) {
        state.all.splice(state.all.indexOf(site), 1)
    },
    [types.SET_SELECTED] (state, data) {
        state.selected = data
    }
}

const actions = {
    addSite ({state, dispatch, commit}, payload) {
        commit(types.ADD_SITE, payload || {})
    },
    removeSite ({state, dispatch, commit}, payload) {
        commit(types.REMOVE_SITE, payload || {})
    }
}

const getters = {}

export default {state, mutations, actions, getters, types}
