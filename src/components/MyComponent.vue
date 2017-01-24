<template>
    <div class="hello">
        <h2>Login</h2>
        <button v-on:click="authenticate">Login</button>
    </div>
</template>

<script type="text/babel">
  export default {
    name: 'my-component',
    methods: {
      authenticate: function () {
        this.axios.get('project/content-types').then((response) => {
          console.log(response.data)
        })
      }
    }
  }
</script>
