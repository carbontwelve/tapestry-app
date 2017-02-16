import merge from 'deepmerge'
//
// The workspace stores the current project workspace related items such as all files, all content types, etc. This may
// be cached in the future to enable an offline mode.
// For now the lastSynced timestamp will allow a timer to keep this relatively in sync every so often.
//

// @todo place this in a helper file?
// @link http://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
function setObjectByDot (obj, is, value) {
    if (typeof is === 'string') {
        return setObjectByDot(obj, is.split('.'), value)
    } else if (is.length === 1 && value !== undefined) {
        let r = (obj[is[0]] = value)
        return r
    } else if (is.length === 0) {
        return obj
    } else {
        return setObjectByDot(obj[is[0]], is.slice(1), value)
    }
}

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
        if (typeof payload === 'object') {
            state.files.selected = merge(f, payload)
        } else {
            let mutations = JSON.parse(payload)
            Object.keys(mutations).forEach((k) => {
                setObjectByDot(state.files.selected, k, mutations[k])
            })
        }
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
    applyActionToFile ({state, dispatch, commit}, payload) {
        return new Promise((resolve, reject) => {
            let file = {}
            if (payload.file) {
                file = payload.file
            }
            switch (payload.action) {
            case 'schedule':
                file = merge(file, {
                    attributes: {
                        frontMatter: {
                            draft: false,
                            date: 1513036800
                        }
                    }
                })
                break
            case 'unPublish':
            case 'unSchedule':
                file = merge(file, {
                    attributes: {
                        frontMatter: {
                            draft: true,
                            date: null
                        }
                    }
                })
                break
            case 'publish':
                file = merge(file, {
                    attributes: {
                        frontMatter: {
                            draft: false,
                            date: Math.floor(Date.now() / 1000)
                        }
                    }
                })
                break
            }
            if (!payload.file && state.files.selected) {
                commit(types.MUTATE_SELECTED_WORKSPACE_FILE, file)
                resolve()
            }
            if (payload.id && payload.attributes && payload.attributes.contentType) {
                commit(types.MUTATE_WORKSPACE_FILE, file)
                resolve()
            }
            reject('File could not be found in store.')
        })
    },
    mutateSelectedFile ({state, dispatch, commit}, payload) {
        commit(types.MUTATE_SELECTED_WORKSPACE_FILE, payload)
        // If we are passed the entire file object then we can update the workspace file too, this is because
        // the entire file object is only passed to this method upon a successful push to the API
        if (payload.id && payload.attributes && payload.attributes.contentType) {
            commit(types.MUTATE_WORKSPACE_FILE, payload)
        }
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
