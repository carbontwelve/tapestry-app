<template>
    <tr>
        <td style="width: 1.5rem; vertical-align: middle; text-align: center">
            <span class="icon is-small" style="vertical-align: middle;"><i class="fa fa-file-text-o" aria-hidden="true"></i></span>
        </td>
        <td>
            <strong>{{ fileTitle() }}</strong>
            <span class="is-block content-actions">
                <router-link class="button is-outlined is-small" :to="{name: 'ContentTypeFileEditor', params: {file: file.id}}" :disabled="doingAction">Edit</router-link>
                <a class="is-danger button is-outlined is-small" @click="doFileAction({id: file.attributes.contentType + '/' + file.id, action: 'delete'})" :disabled="doingAction">Delete</a>
                <a class="button is-outlined is-small" :disabled="doingAction">View</a>
                <a class="button is-outlined is-small" v-if="!isScheduled() && !isPublished()" @click="doFileAction({id: file.attributes.contentType + '/' + file.id, action: 'publish'})" :class="{'is-loading': (currentAction === 'unPublish')}" :disabled="doingAction">Publish Now</a>
                <a class="button is-outlined is-small" v-if="isPublished()" @click="doFileAction({id: file.attributes.contentType + '/' + file.id, action: 'unPublish'})" :class="{'is-loading': (currentAction === 'publish')}" :disabled="doingAction">Unpublish</a>
                <a class="button is-outlined is-small" @click="doFileAction('file-action', {id: file.attributes.contentType + '/' + file.id, action: 'clone'})" :disabled="doingAction">Clone</a>
            </span>
        </td>
        <td>
            <span class="is-block" v-if="!isPublished() && isScheduled()">Scheduled For:</span>
            <span class="is-block" v-if="!isPublished() && !isScheduled()">Last Modified:</span>
            <span class="is-block" v-if="isPublished()">Published:</span>
            <nice-date :date="fileDate()"></nice-date>
        </td>
    </tr>
</template>

<script type="text/babel">
    import FileTrait from '../../../traits/file'
    import NiceDate from '../NiceDate'
    export default {
        name: 'ContentTypeContentTableRow',
        data: () => {
            return {
                doingAction: false,
                currentAction: null
            }
        },
        props: {
            file: {
                type: Object,
                required: true
            }
        },
        components: {
            NiceDate
        },
        methods: {
            ...FileTrait,
            doFileAction (e) {
                if (this.doingAction) {
                    return
                }
                let _vm = this
                _vm.doingAction = true
                _vm.currentAction = e.action
                this.$store.dispatch('applyActionToFile', e).then((f) => {
                    this.$setProjectFile(f).then((response) => {
                        _vm.doingAction = false
                        _vm.currentAction = null
                    })
                })
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    a.button{
        text-decoration: none;
    }
</style>