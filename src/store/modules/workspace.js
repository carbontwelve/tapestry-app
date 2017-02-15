import merge from 'deepmerge'
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
    MUTATE_SELECTED_WORKSPACE_FILE: 'MUTATE_SELECTED_WORKSPACE_FILE',
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
        let f = state.files.items[payload.attributes.contentType][payload.id]
        f.dirty = true
        state.files.items[payload.attributes.contentType][payload.id] = merge(f, payload)
    },
    [types.MUTATE_SELECTED_WORKSPACE_FILE] (state, payload) {
        let f = state.files.selected
        f.dirty = true
        state.files.selected = merge(f, payload)
    },
    [types.SET_SELECTED_WORKSPACE_FILE] (state, payload) {
        state.files.selected = payload
    }
}

const actions = {
    setWSFilesPayload ({state, dispatch, commit}, payload) {
        let tmp = {
            items: {},
            order: {}
        }
        let taxonomyCache = {}
        payload.data.forEach((f) => {
            if (!tmp.items[f.attributes.contentType]) {
                tmp.items[f.attributes.contentType] = {}
                tmp.order[f.attributes.contentType] = []
            }

            // Identify Taxonomies
            if (!taxonomyCache[f.attributes.contentType]) {
                if (state.contentTypes.items[f.attributes.contentType].attributes.taxonomies) {
                    taxonomyCache[f.attributes.contentType] = state.contentTypes.items[f.attributes.contentType].attributes.taxonomies
                }
            }

            // Ensure that all files belonging to a content type have all its taxonomies set, even if just to a default
            // empty array.
            if (taxonomyCache[f.attributes.contentType]) {
                let taxonomies = taxonomyCache[f.attributes.contentType]
                let taxonomyLen = taxonomies.length
                for (let i = 0; i < taxonomyLen; i++) {
                    let fileClassifications = f.attributes.frontMatter[taxonomies[i]]
                    if (!fileClassifications) {
                        f.attributes.frontMatter[taxonomies[i]] = []
                    }
                }
            }

            f.dirty = false
            tmp.items[f.attributes.contentType][f.id] = f
            tmp.order[f.attributes.contentType].push(f.id)
        })
        commit(types.SYNC_WORKSPACE_FILES_FROM_API, tmp)
    },
    setSelectedFile ({state, dispatch, commit}, payload) {
        return new Promise((resolve, reject) => {
            if (!state.files.items[payload.contentType][payload.file]) {
                reject('File not found for [' + payload.contentType + '/' + payload.file + ']')
            }
            resolve(commit(types.SET_SELECTED_WORKSPACE_FILE, state.files.items[payload.contentType][payload.file]))
        })
    },
    mutateSelectedFile ({state, dispatch, commit}, payload) {
        commit(types.MUTATE_SELECTED_WORKSPACE_FILE, payload)
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
