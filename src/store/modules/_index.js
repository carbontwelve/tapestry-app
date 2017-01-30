const files = require.context('.', false, /\.js$/)
const modules = {}
const actions = {}
const getters = {}
const types = {}

files.keys().forEach((key) => {
    if (key === './_index.js') return
    modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export {modules, actions, getters, types}
