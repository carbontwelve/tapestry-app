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
        }),
        new MenuItem({
            title: 'Blog',
            meta: {
                'icon': 'fa-folder-o'
            },
            children: [
                new MenuItem({title: 'Content', route: 'Dashboard'}),
                new MenuItem({title: 'Categories', route: 'Dashboard'}),
                new MenuItem({title: 'Tags', route: 'Dashboard'})
            ]
        }),
        new MenuItem({
            title: 'Pages',
            meta: {
                'icon': 'fa-folder-o'
            },
            children: [
                new MenuItem({title: 'Content', route: 'Dashboard'}),
                new MenuItem({title: 'Categories', route: 'Dashboard'}),
                new MenuItem({title: 'Tags', route: 'Dashboard'})
            ]
        }),
        new MenuItem({
            title: 'Uploads',
            route: 'Uploads',
            meta: {
                'icon': 'fa-files-o'
            }
        }),
        new MenuItem({
            title: 'File Explorer',
            route: 'File Explorer',
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
