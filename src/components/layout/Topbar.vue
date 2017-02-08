<template>
    <nav class="level app-levelbar">
        <div class="level-left">
            <div class="level-item">
                <h3 class="subtitle is-5">
                    <strong>{{ name }}</strong>
                </h3>
            </div>
        </div>

        <div class="level-right is-hidden-mobile">
            <breadcrumb :list="list"></breadcrumb>
        </div>
    </nav>
</template>
<script type="text/babel">
    import Breadcrumb from '../Breadcrumb'
    import {capitalize} from '../../strings'

    function identifyRouteLabel (currentRoute, route) {
        let label = null
        if (currentRoute.params) {
            if (route && route.meta && route.meta.label) {
                label = route.meta.label
            } else if (currentRoute.meta && currentRoute.meta.label) {
                label = currentRoute.meta.label
            }
            if (label !== null) {
                Object.keys(currentRoute.params).forEach(key => {
                    label = label.replace(':' + key, capitalize(currentRoute.params[key]))
                })
                return capitalize(label)
            }
        }
        if (route && route.name) {
            return capitalize(route.name)
        }
        return capitalize(currentRoute.name)
    }

    export default {
        components: {
            Breadcrumb
        },
        data () {
            return {
                list: null
            }
        },
        created () {
            this.getList()
        },
        computed: {
            name () {
                return identifyRouteLabel(this.$route)
            }
        },
        methods: {
            getList () {
                let matched = this.$route.matched.filter(item => item.name)
                // Filter out any ignored
                matched = matched.filter(function (obj) {
                    return !((obj.meta && obj.meta.ignore) && obj.meta.ignore === true)
                })
                let _vm = this
                // Convert to object or array (if has parent defined)
                matched = matched.map(function (obj) {
                    if (obj.meta && obj.meta.parent) {
                        // ... line 33 https://github.com/vuejs/vue-router/blob/dev/src/components/link.js
                        let { route } = _vm.$router.resolve({name: obj.meta.parent}, _vm.$route, false)
                        return [
                            {
                                route: {name: route.name, params: (route.params) ? route.params : {}},
                                label: identifyRouteLabel(_vm.$route, route)
                            },
                            {
                                route: {name: obj.name, params: (_vm.$route.params) ? _vm.$route.params : {}},
                                label: identifyRouteLabel(_vm.$route, obj)
                            }
                        ]
                    }
                    return {
                        route: {name: obj.name, params: (_vm.$route.params) ? _vm.$route.params : {}},
                        label: identifyRouteLabel(_vm.$route, obj)
                    }
                })
                // Flatten matched, because if a route has a parent defined the mapping will replace an item
                // with an array rather than an object, thus the requirement of flattening.
                for (let i = matched.length; i > 0; i--) {
                    if (Array.isArray(matched[i])) {
                        let x = matched.splice(i, 1)
                        let c = 1
                        x[0].forEach((v) => {
                            matched.splice(i + c, 0, v)
                            c++
                        })
                    }
                }
                let first = matched[0]
                if (first && (first.label !== 'Projects')) {
                    matched = [{label: 'Projects', route: '/'}].concat(matched)
                }
                this.list = matched
            }
        },
        watch: {
            $route () {
                this.getList()
            }
        }
    }
</script>
