<template>
    <loading-screen :loading="isLoading" loadingText="Syncing with API" inside>
        <div class="file-editor" v-if="!isLoading">

            <nav class="nav">
                <div class="nav-left flex">
                    <p class="nav-item control has-addons flex">
                        <input class="input flex" type="text" placeholder="file title" v-model="file.data.attributes.frontMatter.title">
                        <a class="button">
                            <span class="icon is-small">
                                <i class="fa fa-th-list" aria-hidden="true"></i>
                            </span>
                            <span>Properties</span>
                        </a>
                    </p>
                </div>

                <div class="nav-right">
                    <p class="nav-item">
                        <a class="button is-primary" :class="{'is-loading': isSaving}" @click="changeTitle">
                            <span class="icon">
                                <i class="fa fa-save" aria-hidden="true"></i>
                            </span>
                            <span>Save</span>
                        </a>
                    </p>
                </div>
            </nav>

            <div class="control">
                <label class="label">File Content</label>
                <div class="control">
                    <textarea class="textarea" v-model="file.data.attributes.fileContent"></textarea>
                </div>
            </div>
        </div>
    </loading-screen>
</template>

<script>
    import File from '../models/file'
    import LoadingScreen from '../components/layout/LoadingScreen'
    export default {
        name: 'FileEditor',
        components: {
            LoadingScreen
        },
        data () {
            return {
                propertiesDisplay: false,
                isLoading: true,
                isSaving: false,
                file: null
            }
        },
        created () {
            this.fetchData()
        },
        watch: {
            '$route': 'fetchData'
        },
        methods: {
            changeTitle () {
                this.file.data.attributes.frontMatter.title = Date.now()
                this.isSaving = true
            },
            fetchData () {
                let _vm = this
                this.$getProjectFile().then((response) => {
                    _vm.file = new File(response.data)
                }).then(() => {
                    _vm.isLoading = false
                })
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .nav-left{
        flex-grow:1;
        .nav-item{
            flex-grow: 1;
            a{
                flex-grow:0;
            }
            input{
                flex-grow: 1;
            }
        }
    }
    .nav-right{
        flex-shrink:1;
        flex-grow:0;
    }
</style>
