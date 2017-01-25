<template>
  <div id="app">
    <Navbar :show="true"></Navbar>
    <Sidebar :show="true"></Sidebar>
    <section class="app-main">
      <div class="container is-fluid is-marginless app-content">
        <router-view></router-view>
      </div>
    </section>
  </div>
</template>

<script>
import Navbar from './components/NavBar'
import Sidebar from './components/Sidebar'
import { mapState } from 'vuex'
export default {
  name: 'app',
  data () {
    return { parentMsg: 'yo' }
  },
  components: {
    Navbar,
    Sidebar
  },
  computed: {
    ...mapState(['sites'])
  }
}
</script>

<style lang="less">
  @import './assets/main.less';

  .app-main{
    padding-top: 50px;
    margin-left: 180px;
    transform: translateZ(0);
  }

  .app-navbar {
    position: fixed;
    min-width: 100%;
    z-index: 1024;
  }
</style>
