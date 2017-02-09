<template>
    <loading-screen :loading="isLoading" loadingText="Syncing with API" inside>
        <div class="file-editor" v-if="!isLoading" style="background: white">
            <nav class="nav" style="z-index: auto">
                <div class="toolbar flex">
                    <p class="nav-item control has-addons flex">
                        <input class="input flex" type="text" placeholder="file title" v-model="file.data.attributes.frontMatter.title">
                        <a class="button is-primary" :class="{'is-loading': isSaving, 'is-disabled': !isModified}" @click="saveChanges">
                                    <span class="icon">
                                        <i class="fa fa-save" aria-hidden="true"></i>
                                    </span>
                            <span>Save</span>
                        </a>
                    </p>
                </div>
            </nav>
            <div class="columns">
                <div class="column is-three-quarters" style="padding-bottom: 0;">
                    <div class="codemirror">
                        <codemirror v-model="file.data.attributes.fileContent" :options="editorOption"></codemirror>
                    </div>
                </div>
                <div class="column">
                    <div class="card" style="margin-right: 0.75rem;">
                        <header class="card-header">
                            <p class="card-header-title">
                                Properties
                            </p>
                            <a class="card-header-icon">
                              <span class="icon">
                                <i class="fa fa-angle-down"></i>
                              </span>
                            </a>
                        </header>
                        <div class="card-content" style="padding: 3px 1px 1px 1px;">
                            <div class="content">
                                <table class="table is-bordered is-stripped is-narrow" style="margin-bottom: 0;">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody v-for="(item, index) in file.data.attributes.frontMatter">
                                        <tr>
                                            <td>{{ index }}</td>
                                            <td>{{ item }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="card" style="margin-right: 0.75rem; margin-top:0.75rem">
                        <header class="card-header">
                            <p class="card-header-title">
                                Attributes
                            </p>
                            <a class="card-header-icon">
                              <span class="icon">
                                <i class="fa fa-angle-down"></i>
                              </span>
                            </a>
                        </header>
                        <div class="card-content" style="padding: 3px 1px 1px 1px;">
                            <div class="content">
                                <table class="table is-bordered is-stripped is-narrow" style="margin-bottom: 0;">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Value</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Last Modified</td>
                                            <td><nice-date :date="file.data.attributes.last_modified * 1000"></nice-date></td>
                                        </tr>
                                        <tr v-if="!file.data.attributes.frontMatter.draft">
                                            <td>Published</td>
                                            <td><nice-date :date="file.data.attributes.frontMatter.date * 1000"></nice-date></td>
                                        </tr>
                                        <tr v-else>
                                            <td>Scheduled</td>
                                            <td><nice-date :date="file.data.attributes.frontMatter.date * 1000"></nice-date></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </loading-screen>
</template>

<script>
    import CodeMirrorMeta from 'vue-codemirror/metas'
    import { codemirror } from 'vue-codemirror'
    import File from '../models/file'
    import LoadingScreen from '../components/layout/LoadingScreen'
    import NiceDate from '../components/UI/NiceDate'
    export default {
        name: 'FileEditor',
        components: {
            LoadingScreen,
            codemirror,
            NiceDate
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
            saveChanges () {
                let _vm = this
                this.isSaving = true
                this.$setProjectFile(this.file).then((response) => {
                    _vm.file = new File(response.data)
                }).then(() => {
                    _vm.isSaving = false
                    _vm.isModified = false
                }).catch((err) => {
                    console.error(err.message)
                    _vm.isSaving = false
                })
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
        .toolbar {
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
        .CodeMirror {
            min-height: ~"calc(100vh - 200px)";
        }
    }
</style>
