import Site from '../../models/site'
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

// Mutate the "all" state so that each item is an instance of Site
if (state.all.length > 0) {
    for (var i = 0; i <= state.all.length - 1; i++) {
        state.all[i] = new Site(state.all[i])
    }
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
        commit(types.ADD_SITE, payload || {})

        // If this is the first site then it needs to be set as the selected site
        if (state.all.length === 1) {
            dispatch('setSelected', payload)
        }
    },
    removeSite ({state, dispatch, commit}, payload) {
        // @todo you shouldn't be able to remove the currently selected site, or the last site in the list
        commit(types.REMOVE_SITE, payload || {})
    },
    setSelected ({state, dispatch, commit}, payload) {
        commit(types.SET_SELECTED, payload || null)
    }
}

const getters = {
    totalSites: state => state.all.length
}

export default {state, mutations, actions, getters, types}
