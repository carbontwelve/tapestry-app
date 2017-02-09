<template>
    <span>{{ pretty }}</span>
</template>

<script>
    import Moment from 'moment'
    export default {
        props: {
            date: { required: true },
            format: { default: 'MMMM Do YYYY, h:mm:ss a', type: String, required: false }
        },
        computed: {
            now () { return Moment() },
            pretty () { return Moment(this.date).format(this.format) }
        }
    }
</script>