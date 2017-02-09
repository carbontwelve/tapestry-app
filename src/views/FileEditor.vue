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
                        <a class="button is-primary" :class="{'is-loading': isSaving, 'is-disabled': !isModified}" @click="changeTitle">
                            <span class="icon">
                                <i class="fa fa-save" aria-hidden="true"></i>
                            </span>
                            <span>Save</span>
                        </a>
                    </p>
                </div>
            </nav>

            <div class="codemirror">
                <!-- codemirror -->
                <codemirror v-model="file.data.attributes.fileContent" :options="editorOption"></codemirror>
            </div>
        </div>
    </loading-screen>
</template>

<script>
    import CodeMirrorMeta from 'vue-codemirror/metas'
    import { codemirror } from 'vue-codemirror'
    import File from '../models/file'
    import LoadingScreen from '../components/layout/LoadingScreen'
    export default {
        name: 'FileEditor',
        components: {
            LoadingScreen,
            codemirror
        },
        data () {
            return {
                editorOption: {
                    tabSize: 4,
                    styleActiveLine: true,
                    lineNumbers: true,
                    foldGutter: true,
                    line: true,
                    mode: {name: 'markdown'},
                    theme: 'solarized light',
                    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
                },
                propertiesDisplay: false,
                isLoading: true,
                isSaving: false,
                isModified: false,
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
                    let mode = CodeMirrorMeta.findModeByExtension(_vm.file.data.attributes.ext)
                    if (mode) {
                        _vm.editorOption.mode.name = mode.mode
                    }
                }).then(() => {
                    _vm.$watch('file.data', function () {
                        if (_vm.isModified || _vm.isLoading) {
                            return
                        }
                        _vm.isModified = true
                    }, {deep: true})
                    _vm.isLoading = false
                })
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .file-editor {
        .nav-left {
            flex-grow: 1;
            .nav-item {
                flex-grow: 1;
                a {
                    flex-grow: 0;
                }
                input {
                    flex-grow: 1;
                }
            }
        }
        .nav-right {
            flex-shrink: 1;
            flex-grow: 0;
        }
        .CodeMirror {
            min-height: ~"calc(100vh - 200px)";
        }
    }
</style>
