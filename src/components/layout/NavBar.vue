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
            <project-selector></project-selector>
            <a class="nav-item is-tab">Log out</a>
        </div>
    </nav>
</template>

<script type="text/babel">
    import ProjectSelector from '../project/ProjectSelector'
    export default {
        name: 'navbar',
        components: {
            ProjectSelector
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