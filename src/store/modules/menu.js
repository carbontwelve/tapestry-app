import MenuItem from '../../models/MenuItem'

const types = {
    EXPAND_MENU: 'EXPAND_MENU',
    SET_MENU: 'SET_MENU'
}

const state = {
    items: [
        new MenuItem({
            title: 'Projects',
            route: 'Projects',
            meta: {
                'icon': 'fa-object-group'
            }
        })
    ]
}

const mutations = {
    [types.EXPAND_MENU] (state, menuItem) {
        if (menuItem.index > -1) {

        } else if (menuItem.item && 'expanded' in menuItem.item.meta) {

        }
    },
    [types.SET_MENU] (state, menu) {
        console.log('SET_MENU')
        state.items = menu
    }
}

const actions = {
    setMenuItems ({state, dispatch, commit}, payload) {
        console.log('setMenuItems')
        let menu = [
            new MenuItem({
                title: 'Projects',
                route: 'Projects',
                meta: {
                    'icon': 'fa-object-group'
                }
            }),
            ...payload,
            new MenuItem({
                title: 'Uploads',
                route: 'Uploads',
                meta: {
                    'icon': 'fa-files-o'
                }
            }),
            new MenuItem({
                title: 'File Explorer',
                route: 'FileExplorer',
                meta: {
                    'icon': 'fa-cubes'
                }
            }),
            new MenuItem({
                title: 'Configuration',
                route: 'Configuration',
                meta: {
                    'icon': 'fa-cogs'
                }
            })
        ]
        commit(types.SET_MENU, menu)
    }
}

const getters = {
    getMenuItems: state => state.items
}

export default {state, mutations, actions, getters, types}
