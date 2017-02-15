const types = {
    SYNC_FILES_FROM_API: 'SYNC_FILES_FROM_API',
    MUTATE_FILE: 'MUTATE_FILE',
    SET_SELECTED_FILE: 'SET_SELECTED_FILE'
}

const state = {
    items: {},
    order: [],
    selected: null,
    lastSynced: 0
}

const mutations = {
    [types.SYNC_FILES_FROM_API] (state, payload) {
        state.items = payload.items
        state.order = payload.order
        state.lastSynced = Math.floor(Date.now() / 1000)
    },
    [types.MUTATE_FILE] (state, payload) {
        payload.dirty = true
        state.items[payload.attributes.contentType][payload.id] = payload
    },
    [types.SET_SELECTED_FILE] (state, payload) {
        state.selected = payload
    }
}

const actions = {
    setFilesPayload ({state, dispatch, commit}, payload) {
        let tmp = {
            items: {},
            order: {}
        }
        payload.data.forEach((value) => {
            if (!tmp.items[value.attributes.contentType]) {
                tmp.items[value.attributes.contentType] = {}
                tmp.order[value.attributes.contentType] = []
            }
            value.dirty = false
            tmp.items[value.attributes.contentType][value.id] = value
            tmp.order[value.attributes.contentType].push(value.id)
        })
        commit(types.SYNC_FILES_FROM_API, tmp)
    },
    setSelectedFile ({state, dispatch, commit}, payload) {
        return new Promise((resolve, reject) => {
            if (!state.items[payload.contentType][payload.file]) {
                reject('File not found for [' + payload.contentType + '/' + payload.file + ']')
            }
            resolve(commit(types.SET_SELECTED_FILE, state.items[payload.contentType][payload.file]))
        })
    }
}

const getters = {
    // ...
}

export default {state, mutations, actions, getters, types}
