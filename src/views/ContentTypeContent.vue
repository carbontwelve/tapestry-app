<template>
    <div id="content">
        <loading-screen :loading="isLoading" loadingText="Syncing with API" inside>
            <nav class="nav">
                <div class="nav-left">
                    <p class="nav-item control has-addons">
                        <a class="button">
                            <span class="icon is-small">
                                <i class="fa fa-table" aria-hidden="true"></i>
                            </span>
                        </a>
                        <a class="button">
                            <span class="icon is-small">
                                <i class="fa fa-calendar" aria-hidden="true"></i>
                            </span>
                        </a>
                    </p>
                </div>

                <div class="nav-right">
                    <p class="nav-item">
                        <a class="button is-primary">
                            <span class="icon">
                                <i class="fa fa-plus" aria-hidden="true"></i>
                            </span>
                            <span>Create New</span>
                        </a>
                    </p>
                </div>
            </nav>
            <br>
            <table class="table is-striped is-narrow">
                <thead>
                    <tr>
                        <th style="width: 1.5rem;">&nbsp;</th>
                        <th>Title</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody v-for="item in content">
                    <TableRow :file="item" v-on:file-action="doFileAction"></TableRow>
                </tbody>
            </table>
        </loading-screen>
    </div>
</template>

<script type="text/babel">
    import LoadingScreen from '../components/layout/LoadingScreen'
    import TableRow from '../components/UI/ContentTypeContent/TableRow'
    import {mapState} from 'vuex'
    // import File from '../models/file'
    export default {
        name: 'ContentTypeContent',
        data () {
            return {
                isLoading: false
            }
        },
        components: {
            LoadingScreen,
            TableRow
        },
        created () {
            this.fetchData()
        },
        watch: {
            '$route': 'fetchData'
        },
        computed: {
            ...mapState(['workspace']),
            content: function () {
                return this.workspace.files.items[this.$route.params.contentType]
            }
        },
        methods: {
            doFileAction (e) {
                console.log(e)
            },
            fetchData () {
                // let _vm = this
                // this.$getProjectContentType().then((response) => {
                //     let d = response.data
                //     let content = []
                //     for (let i = 0; i <= d.data.attributes.files.length; i++) {
                //         let fileRelationship = d.data.relationships[d.data.attributes.files[i]]
                //         if (fileRelationship) {
                //             content.push(new File(fileRelationship))
                //         }
                //     }
                //     _vm.content = content
                // }).then(() => {
                //     _vm.isLoading = false
                // })
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .content-actions{
        a{
            text-decoration: underline;
            &:hover{
                color: #00c4a7;
            }
        }
    }
</style>