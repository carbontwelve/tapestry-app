//
// The workspace stores the current project workspace related items such as all files, all content types, etc. This may
// be cached in the future to enable an offline mode.
// For now the lastSynced timestamp will allow a timer to keep this relatively in sync every so often.
//

const types = {
    SYNC_WORKSPACE_FILES_FROM_API: 'SYNC_WORKSPACE_FILES_FROM_API',
    SYNC_WORKSPACE_CONTENTTYPES_FROM_API: 'SYNC_WORKSPACE_CONTENTTYPES_FROM_API',
    MUTATE_WORKSPACE_FILE: 'MUTATE_WORKSPACE_FILE',
    SET_SELECTED_WORKSPACE_FILE: 'SET_SELECTED_WORKSPACE_FILE',
    MUTATE_WORKSPACE_CONTENT_TYPE: 'MUTATE_WORKSPACE_CONTENT_TYPE'
}

const state = {
    files: {
        selected: null,
        items: {},
        order: {},
        orderBy: 'date',
        orderDirection: 'ASC'
    },
    contentTypes: {
        selected: null,
        items: {}
    },
    lastSynced: 0
}

const mutations = {
    [types.SYNC_WORKSPACE_FILES_FROM_API] (state, payload) {
        state.files.items = payload.items
        state.files.order = payload.order
        state.lastSynced = Math.floor(Date.now() / 1000)
    },
    [types.SYNC_WORKSPACE_CONTENTTYPES_FROM_API] (state, payload) {
        state.contentTypes.items = payload
    },
    [types.MUTATE_WORKSPACE_FILE] (state, payload) {
        payload.dirty = true
        state.files.items[payload.attributes.contentType][payload.id] = payload
    },
    [types.SET_SELECTED_WORKSPACE_FILE] (state, payload) {
        state.selected = payload
    }
}

const actions = {
    setWSFilesPayload ({state, dispatch, commit}, payload) {
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
        commit(types.SYNC_WORKSPACE_FILES_FROM_API, tmp)
    },
    setWSContentTypePayload ({state, dispatch, commit}, payload) {
        let tmp = {}
        payload.data.forEach((value) => {
            if (!tmp[value.id]) {
                tmp[value.id] = value
            }
        })
        commit(types.SYNC_WORKSPACE_CONTENTTYPES_FROM_API, tmp)
    }
}

const getters = {
    // ...
}

export default {state, mutations, actions, getters, types}
