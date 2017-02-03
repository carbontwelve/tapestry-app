<template>
    <div class="nav-item" v-if="isInstalled">
        <a class="nav-item">
            <figure class="image is-16x16" style="margin-right: 8px;">
                <img src="http://bulma.io/images/jgthms.png">
            </figure>
            {{ getSelectedProject.name }}
        </a>
    </div>
</template>

<script type="text/babel">
    import {mapGetters} from 'vuex'
    export default {
        name: 'project-selector',
        computed: {
            ...mapGetters(['getSelectedProject', 'isInstalled'])
        }
    }
</script>

<style lang="less" rel="stylesheet/less">

</style>