// lazy loading Components
// https://github.com/vuejs/vue-router/blob/dev/examples/lazy-loading/app.js#L8
export default function (name, index = false) {
    return require(`../views/${name}${index ? '/index' : ''}.vue`)
}
