const types = {
    ADD_PROJECT: 'ADD_PROJECT',
    SET_SELECTED: 'SET_SELECTED'
}

const state = {
    all: [],
    selected: null
}

const mutations = {
    [types.ADD_PROJECT] (state, payload) {
        state.all.push(payload)
    },
    [types.SET_SELECTED] (state, payload) {
        state.selected = payload
    }
}

const actions = {
    addProject ({state, dispatch, commit}, payload) {
        commit(types.ADD_PROJECT, payload || {})
    },
    setSelectedProject ({state, dispatch, commit}, payload) {
        commit(types.SET_SELECTED, payload || null)
    },
    setSelectedProjectById ({state, dispatch, commit}, payload) {
        let project = getters.getProjectById(state, getters)(payload)
        commit(types.SET_SELECTED, project || null)
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
