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
                let _vm = this
                matched = matched.map(function (obj) {
                    return {
                        route: {name: obj.name, params: (_vm.$route.params) ? _vm.$route.params : {}},
                        label: identifyRouteLabel(_vm.$route, obj)
                    }
                })
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
