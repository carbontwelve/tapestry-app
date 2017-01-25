<template>
    <div class="hello">
        <h2>Login</h2>
        <button v-on:click="authenticate">Login</button>
        <button v-on:click="test">TEST</button>
    </div>
</template>

<script type="text/babel">
    var count = 1
    export default {
        name: 'my-component',
        methods: {
            test: function () {
                count++
                this.$store.dispatch('addSite', {count})
            },
            authenticate: function () {
                this.axios.get('project/content-types').then((response) => {
                    console.log(response.data)
                })
            }
        }
    }
</script>
