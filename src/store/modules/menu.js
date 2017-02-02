import MenuItem from '../../models/MenuItem'

const types = {
    EXPAND_MENU: 'EXPAND_MENU'
}

const state = {
    items: [
        new MenuItem({
            title: 'Projects',
            route: 'Projects',
            meta: {
                'icon': 'fa-object-group'
            }
        }),
        new MenuItem({
            title: 'Dashboard',
            route: 'Dashboard',
            meta: {
                'icon': 'fa-tachometer'
            }
        })
    ]
}

const mutations = {
    [types.EXPAND_MENU] (state, menuItem) {
        if (menuItem.index > -1) {

        } else if (menuItem.item && 'expanded' in menuItem.item.meta) {

        }
    }
}

const actions = {}

const getters = {
    getMenuItems: state => state.items
}

export default {state, mutations, actions, getters, types}
