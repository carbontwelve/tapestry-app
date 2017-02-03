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

            <span class="nav-item">
              <a class="button" @click="nuke">
                <span class="icon">
                  <i class="fa fa-trash"></i>
                </span>
              </a>
            </span>
        </div>
    </nav>
</template>

<script type="text/babel">
    import ProjectSelector from '../project/ProjectSelector'
    export default {
        name: 'navbar',
        components: {
            ProjectSelector
        },
        methods: {
            nuke () {
                window.localStorage.clear()
                window.location.reload()
            }
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