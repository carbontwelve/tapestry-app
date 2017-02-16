<template>
    <tr>
        <td style="width: 1.5rem; vertical-align: middle; text-align: center">
            <span class="icon is-small" style="vertical-align: middle;"><i class="fa fa-file-text-o" aria-hidden="true"></i></span>
        </td>
        <td>
            <strong>{{ fileTitle() }}</strong>
            <span class="is-block content-actions">
                <router-link :to="{name: 'ContentTypeFileEditor', params: {file: file.id}}" class="is-black">Edit</router-link> &ndash;
                <a class="is-danger" @click="$emit('file-action', {id: file.attributes.contentType + '/' + file.id, action: 'delete'})">Delete</a> &ndash;
                <a class="is-black">View</a> &ndash;
                <a class="is-black" v-if="!isScheduled() && !isPublished()" @click="$emit('file-action', {id: file.attributes.contentType + '/' + file.id, action: 'publish'})">Publish Now</a>
                <a class="is-black" v-if="isPublished()" @click="$emit('file-action', {id: file.attributes.contentType + '/' + file.id, action: 'unPublish'})">Unpublish</a> &ndash;
                <a class="is-black" @click="$emit('file-action', {id: file.attributes.contentType + '/' + file.id, action: 'clone'})">Clone</a>
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
            ...FileTrait
        }
    }
</script>