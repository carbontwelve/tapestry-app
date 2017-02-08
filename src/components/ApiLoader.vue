<template>
    <div class="api-loader">
        <slot v-if="!isLoading"></slot>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'ApiLoader',
        props: {
            url: {
                type: String,
                required: true
            }
        },
        data: function () {
            return {
                isLoading: true
            }
        },
        methods: {
            getAjax () {
                console.log('getAjax []')
            }
        }
    }
</script>