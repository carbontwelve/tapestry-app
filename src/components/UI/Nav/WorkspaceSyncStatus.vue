<template>
    <div class="nav-item" v-if="isInstalled && hasSelectedProject && workspaceSyncStatus">
        {{ workspaceSyncStatus }}
    </div>
</template>

<script type="text/babel">
    import {mapGetters} from 'vuex'
    export default {
        name: 'workspace-sync-status',
        computed: {
            ...mapGetters(['workspaceSyncStatus', 'hasSelectedProject', 'isInstalled'])
        }
    }
</script>

<style lang="less" rel="stylesheet/less">

</style>