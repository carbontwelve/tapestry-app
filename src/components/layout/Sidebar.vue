<template>
    <aside class="menu app-sidebar animated" :class="{ slideInLeft: show, slideOutLeft: !show }">
        <p class="menu-label">
            General
        </p>
        <ul class="menu-list">
            <li>
                <router-link to="home" active-class="is-active">Home</router-link>
            </li>
            <li>
                <router-link to="dashboard" active-class="is-active">Dashboard</router-link>
            </li>
        </ul>
    </aside>
</template>

<script type="text/babel">
    export default {
        props: {
            show: Boolean
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
    }
</style>