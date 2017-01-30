import { SITES_STORAGE_KEY } from './modules/sites'
import { APP_STORAGE_KEY } from './modules/app'
const localStoragePlugin = store => {
    store.subscribe((mutation, { sites, app }) => {
        window.localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites))
        window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(app))
    })
}
export default [localStoragePlugin]
