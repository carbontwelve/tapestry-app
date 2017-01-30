<template>
    <nav class="nav app-navbar has-shadow animated">
        <div class="nav-left">
            <a class="nav-item">
                <img src="http://bulma.io/images/bulma-logo.png" alt="Bulma logo">
            </a>
        </div>
        <span class="nav-toggle">
             <span></span>
          <span></span>
          <span></span>
        </span>
        <div class="nav-right nav-menu">
            <a class="nav-item is-tab">
                <figure class="image is-16x16" style="margin-right: 8px;">
                    <img src="http://bulma.io/images/jgthms.png">
                </figure>
                Configuration
            </a>
            <!--<a class="nav-item is-tab">Log out</a>-->
        </div>
    </nav>
</template>

<script type="text/babel">
    export default {
        name: 'navbar'
    }
</script>

<style lang="less">
    .app-navbar {
        position: fixed;
        min-width: 100%;
        z-index: 1024;
    }
</style>