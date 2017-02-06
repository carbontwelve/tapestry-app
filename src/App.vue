<template>
    <div id="app">
        <loading-screen :loading="app.isLoading">
            <Navbar></Navbar>
            <Sidebar :show="sidebar.opened && !sidebar.hidden"></Sidebar>
            <section class="app-main" :class="{noNav: !(sidebar.opened && !sidebar.hidden)}">
                <div class="container is-fluid is-marginless app-content">
                    <topbar></topbar>
                    <transition
                            mode="out-in"
                            enter-active-class="fadeIn"
                            leave-active-class="fadeOut"
                            appear>
                        <router-view class="animated"></router-view>
                    </transition>
                </div>
            </section>
        </loading-screen>
    </div>
</template>

<script type="text/babel">
    import Navbar from './components/layout/NavBar'
    import Sidebar from './components/layout/Sidebar'
    import Topbar from './components/layout/Topbar'
    import LoadingScreen from './components/layout/LoadingScreen'
    import {mapState, mapGetters} from 'vuex'
    export default {
        name: 'app',
        data () {
            return {parentMsg: 'yo'}
        },
        created () {
            this.$nextTick(() => this.loadResources())
        },
        mounted () {

        },
        components: {
            Navbar,
            Sidebar,
            Topbar,
            LoadingScreen
        },
        computed: {
            ...mapState(['app']),
            ...mapGetters([
                'sidebar',
                'isInstalled',
                'totalApiEndpoints',
                'hasSelectedProject'
            ])
        },
        methods: {
            loadResources () {
                let _vm = this
                // Check if we have any api endpoints installed
                if (this.totalApiEndpoints === 0) {
                    this.$store.dispatch('setInstalled', false)
                    _vm.$store.dispatch('toggleLoading', false)
                }

                //
                // If we have api endpoints installed sync with their projects
                //
                if (this.totalApiEndpoints > 0) {
                    _vm.$store.dispatch('setSelectedApiEndpoint')
                    Promise.all(this.$syncProjects()).then(() => {
                        if (_vm.hasSelectedProject) {
                            Promise.resolve(this.$syncProject()).then(() => {
                                _vm.$store.dispatch('toggleLoading', false)
                            })
                        }
                    })
                }
            }
        }
    }
</script>

<style type="text/css" lang="less" rel="stylesheet/less">
    @import './assets/main.less';

    .app-main {
        padding-top: 50px;
        margin-left: 180px;
        transform: translateZ(0);

        &.noNav{
            margin-left:0;
        }
    }

    .app-content{
        padding: 20px;
    }
</style>
