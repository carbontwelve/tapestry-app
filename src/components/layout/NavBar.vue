<template>
    <nav class="nav app-navbar has-shadow animated" :class="{ slideInDown: show, slideOutDown: !show }">
        <div class="container">
            <div class="nav-left">
                <a class="nav-item">
                    <img src="http://bulma.io/images/bulma-logo.png" alt="Bulma logo">
                </a>
                <router-link to="/" class="nav-item is-tab is-hidden-mobile" active-class="is-active">Go to Foo
                </router-link>
                <router-link to="/bar" class="nav-item is-tab is-hidden-mobile" active-class="is-active">Go to Bar
                </router-link>
            </div>
            <span class="nav-toggle">
      <span></span>
      <span></span>
      <span></span>
    </span>
            <div class="nav-right nav-menu">
                <router-link to="/" class="nav-item is-tab is-hidden-tablet" active-class="is-active">Go to Foo
                </router-link>
                <router-link to="/bar" class="nav-item is-tab is-hidden-tablet" active-class="is-active">Go to Bar
                </router-link>
                <a class="nav-item is-tab">
                    <figure class="image is-16x16" style="margin-right: 8px;">
                        <img src="http://bulma.io/images/jgthms.png">
                    </figure>
                    Configuration
                </a>
                <a class="nav-item is-tab">Log out</a>
            </div>
        </div>
    </nav>
</template>

<script type="text/babel">
    export default {
        name: 'navbar',
        props: {
            show: Boolean
        }
    }
</script>

<style lang="less">
    .app-navbar {
        position: fixed;
        min-width: 100%;
        z-index: 1024;
    }
</style>