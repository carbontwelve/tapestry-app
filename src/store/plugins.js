import { SITES_STORAGE_KEY } from './modules/sites'
const localStoragePlugin = store => {
    store.subscribe((mutation, { sites }) => {
        window.localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites.all))
    })
}
export default [localStoragePlugin]
