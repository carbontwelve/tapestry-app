export var SITES_STORAGE_KEY = 'sites'

const types = {
    ADD_SITE: 'ADD_SITE',
    MODIFY_SITE: 'MODIFY_SITE',
    REMOVE_SITE: 'REMOVE_SITE',
    SET_SELECTED: 'SET_SELECTED'
}

const state = (window.localStorage.getItem(SITES_STORAGE_KEY) !== null) ? JSON.parse(window.localStorage.getItem(SITES_STORAGE_KEY)) : {
    selected: null,
    all: []
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
    [types.SET_SELECTED] (state, site) {
        state.selected = site
    }
}

const actions = {
    addSite ({state, dispatch, commit}, payload) {
        // @todo if this is the first site in the list then it should also be set to be the selected one
        commit(types.ADD_SITE, payload || {})
    },
    removeSite ({state, dispatch, commit}, payload) {
        // @todo you shouldn't be able to remove the currently selected site, or the last site in the list
        commit(types.REMOVE_SITE, payload || {})
    },
    setSelected ({state, dispatch, commit}, payload) {
        commit(types.SET_SELECTED, payload || null)
    }
}

const getters = {}

export default {state, mutations, actions, getters, types}
