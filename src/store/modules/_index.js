const files = require.context('.', false, /\.js$/)
const modules = {}
const actions = {}
const getters = {}
const types = {}

files.keys().forEach((key) => {
    if (key === './_index.js') return
    modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
    actions[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
    getters[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
    types[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
    // if (key === './_index.js') return
    // if (files(key).default.modules) {
    //   modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default.modules
    // }
    // if (files(key).default.actions) {
    //   actions[key.replace(/(\.\/|\.js)/g, '')] = files(key).default.actions
    // }
    // if (files(key).default.getters) {
    //   getters[key.replace(/(\.\/|\.js)/g, '')] = files(key).default.getters
    // }
    // if (files(key).default.types) {
    //   types[key.replace(/(\.\/|\.js)/g, '')] = files(key).default.types
    // }
})

export {modules, actions, getters, types}
