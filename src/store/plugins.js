import { API_STORAGE_KEY } from './modules/api'
import { APP_STORAGE_KEY } from './modules/app'
const localStoragePlugin = store => {
    store.subscribe((mutation, { api, app }) => {
        window.localStorage.setItem(API_STORAGE_KEY, JSON.stringify(api))
        window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(app))
    })
}
export default [localStoragePlugin]
