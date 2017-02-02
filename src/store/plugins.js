import { API_STORAGE_KEY } from './modules/api'
import { APP_STORAGE_KEY } from './modules/app'
import { PROJECT_STORAGE_KEY } from './modules/projects'
const localStoragePlugin = store => {
    store.subscribe((mutation, { api, app, projects }) => {
        window.localStorage.setItem(API_STORAGE_KEY, JSON.stringify(api))
        window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(app))
        window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects.selected))
    })
}
export default [localStoragePlugin]
