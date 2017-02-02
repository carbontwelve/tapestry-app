<template>
    <aside class="menu app-sidebar animated" :class="{ slideInLeft: show, slideOutLeft: !show, 'is-hidden': displayMenu }">
        <p class="menu-label">
            General
        </p>
        <ul class="menu-list">
            <template v-for="item in menu.items">
                <li>
                    <router-link v-if="item.route" :to="{name: item.route}" exact>
                        <span class="icon is-small"><i :class="['fa', item.meta.icon]"></i></span>
                        <span class="menu-label">{{ item.meta.label || item.title }}</span>
                    </router-link>

                    <a v-else>
                        <span class="icon is-small"><i :class="['fa', item.meta.icon]"></i></span>
                        <span class="menu-label">{{ item.meta.label || item.title }}</span>
                    </a>

                    <template v-if="item.children && item.children.length > 0">
                        <ul>
                            <li v-for="childItem in item.children">
                                <router-link :to="{name: childItem.route}" exact>
                                    {{ childItem.meta && childItem.meta.label || childItem.title }}
                                </router-link>
                            </li>
                        </ul>
                    </template>
                </li>
            </template>
        </ul>
    </aside>
</template>

<script type="text/babel">
    var isHidden = true
    import {mapState} from 'vuex'
    export default {
        props: {
            show: Boolean
        },
        computed: {
            ...mapState(['menu']),
            displayMenu: function () {
                if (this.show === true) {
                    isHidden = false
                }
                return isHidden
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less">
    .app-sidebar {
        position: fixed;
        top: 49px;
        left: 0;
        bottom: 0;
        padding: 20px 0 50px;
        width: 180px;
        min-width: 45px;
        max-height: 100vh;
        height: ~"calc(100% - 50px)";
        z-index: 1023;
        background: #FFF;
        box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);
        overflow-y: auto;
        overflow-x: hidden;

        .menu-label {
            padding-left: 5px;
        }

        .is-active .menu-label{
            color: white;
        }

        .icon {
            vertical-align: baseline;
            &.is-angle {
                position: absolute;
                right: 10px;
                transition: transform .377s ease;
            }
        }
    }
</style>