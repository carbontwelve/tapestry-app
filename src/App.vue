<template>
    <div id="app">
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
    </div>
</template>

<script type="text/babel">
    import Navbar from './components/layout/NavBar'
    import Sidebar from './components/layout/Sidebar'
    import Topbar from './components/layout/Topbar'
    import {mapState, mapGetters} from 'vuex'
    export default {
        name: 'app',
        data () {
            return {parentMsg: 'yo'}
        },
        components: {
            Navbar,
            Sidebar,
            Topbar
        },
        computed: {
            ...mapState(['sites']),
            ...mapGetters({
                sidebar: 'sidebar',
                isInstalled: 'isInstalled'
            })
        }
    }
</script>

<style type="text/css" lang="less" rel="less">
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
