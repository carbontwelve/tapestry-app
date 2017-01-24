<template>
  <div id="app">

    <NavBar></NavBar>


    <h1>Hello World!</h1>
    <p>
      <router-link to="/">Go to Foo</router-link>
      <router-link to="/bar">Go to Bar</router-link>
    </p>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from './components/NavBar'
export default {
  name: 'app',
  data () {
    return { parentMsg: 'yo' }
  },
  components: {
    NavBar
  }
}
</script>

<style lang="less">
  @import './assets/main.less';
</style>
