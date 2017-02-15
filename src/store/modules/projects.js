export var PROJECT_STORAGE_KEY = 'projects'

const types = {
    ADD_PROJECT: 'ADD_PROJECT',
    SET_SELECTED_PROJECT: 'SET_SELECTED_PROJECT',
    SYNC_PROJECTS_WITH_API: 'SYNC_PROJECTS_WITH_API'
}

const state = {
    all: [],
    selected: (window.localStorage.getItem(PROJECT_STORAGE_KEY) !== null) ? JSON.parse(window.localStorage.getItem(PROJECT_STORAGE_KEY)) : null,
    lastSynced: 0
}

const mutations = {
    [types.SYNC_PROJECTS_WITH_API] (state, payload) {
        state.lastSynced = Math.floor(Date.now() / 1000)
        state.all = payload
    },
    [types.ADD_PROJECT] (state, payload) {
        state.all.push(payload)
    },
    [types.SET_SELECTED_PROJECT] (state, payload) {
        console.log('SET_SELECTED_PROJECT')
        state.selected = payload
    }
}

const actions = {
    addProject ({state, dispatch, commit}, payload) {
        commit(types.ADD_PROJECT, payload || {})
    },
    setSelectedProject ({state, dispatch, commit}, payload) {
        console.log('setSelectedProject')
        commit(types.SET_SELECTED_PROJECT, (payload || null))
    },
    setSelectedProjectById ({state, dispatch, commit}, payload) {
        let project = getters.getProjectById(state, getters)(payload)
        commit(types.SET_SELECTED_PROJECT, project || null)
    },
    syncWithAPI ({state, dispatch, commit}, payload) {
        commit(types.SYNC_PROJECTS_WITH_API, payload || [])
        if (state.selected) {
            if (!getters.getProjectById(state, getters)(state.selected.id)) {
                console.log('reset selected project')
                dispatch('setSelectedProject')
            }
        }
    }
}

const getters = {
    totalProjects: state => state.all.length,
    hasSelectedProject: state => state.selected !== null,
    getSelectedProject: state => state.selected,
    getProjectById: (state, getters) => (id) => {
        return state.all.find(p => p.id === id)
    }
}

export default {state, mutations, actions, getters, types}
