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
                                Publishing
                            </p>
                            <a class="card-header-icon">
                              <span class="icon">
                                <i class="fa fa-angle-down"></i>
                              </span>
                            </a>
                        </header>
                        <div class="card-content">
                            <div class="content">
                                <span v-if="isPublished()">Published on <nice-date :date="fileDate()"></nice-date>, <a @click="unpublish">Unpublish</a></span>
                                <span v-else-if="isScheduled()">Scheduled for <nice-date :date="fileDate()"></nice-date>, <a @click="publish">Publish now</a>, <a @click="displaySchedule">Modify schedule</a> or <a @click="cancelSchedule">Cancel</a></span>
                                <span v-else-if="isDraft()">Draft, <a @click="publish">Publish now</a> or <a @click="displaySchedule">Schedule</a></span>
                                <div v-if="settingSchedule" style="margin-top:0.6rem;">
                                    <label class="label">Schedule</label>
                                    <p class="control has-addons flex">
                                        <datepicker :value="scheduleTime" :config="{ wrap: true }">
                                            <a @click="schedule" class="button" :disabled="scheduleTime===''"><i class="fa fa-floppy-o" aria-hidden="true"></i></a>
                                            <a @click="hideSchedule" class="button"><i class="fa fa-close" aria-hidden="true"></i></a>
                                        </datepicker>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card" style="margin-right: 0.75rem; margin-top:0.75rem">
                        <header class="card-header">
                            <p class="card-header-title">
                                Taxonomy
                            </p>
                            <a class="card-header-icon">
                              <span class="icon">
                                <i class="fa fa-angle-down"></i>
                              </span>
                            </a>
                        </header>
                        <div class="card-content">
                            <div class="content">
                                <template v-for="(classifications, taxonomy) in taxonomies">
                                    <label class="label">{{ taxonomy + ':' }}</label>
                                    <p class="control">
                                        <input-tag :on-change="updateTaxonomies(taxonomy, classifications)" :tags="taxonomies[taxonomy]" :placeholder="taxonomy"></input-tag>
                                    </p>
                                </template>
                            </div>
                        </div>
                    </div>

                    <div class="card" style="margin-right: 0.75rem; margin-top:0.75rem">
                        <header class="card-header">
                            <p class="card-header-title">
                                Front Matter
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
                                            <td>Filename</td>
                                            <td>{{ fileName }}</td>
                                        </tr>
                                        <tr>
                                            <td>Last Modified</td>
                                            <td><nice-date :date="lastModified"></nice-date></td>
                                        </tr>
                                        <tr v-if="isPublished()">
                                            <td>Published</td>
                                            <td><nice-date :date="fileDate()"></nice-date></td>
                                        </tr>
                                        <tr v-if="isScheduled()">
                                            <td>Scheduled</td>
                                            <td><nice-date :date="fileDate()"></nice-date></td>
                                        </tr>
                                        <tr>
                                            <td>Revision</td>
                                            <td>@todo</td>
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

<script type="text/babel">
    import { capitalize } from '../strings'
    import CodeMirrorMeta from 'vue-codemirror/metas'
    import { codemirror } from 'vue-codemirror'
    import LoadingScreen from '../components/layout/LoadingScreen'
    import NiceDate from '../components/UI/NiceDate'
    import InputTag from 'vue-input-tag'
    import Datepicker from 'vue-bulma-datepicker'
    export default {
        name: 'FileEditor',
        components: {
            LoadingScreen,
            codemirror,
            NiceDate,
            InputTag,
            Datepicker
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
                settingSchedule: false,
                isLoading: true,
                isSaving: false,
                isModified: false,
                file: null,
                scheduleTime: '',
                taxonomies: {}
            }
        },
        computed: {
            fileName () {
                return this.file.data.attributes.name + '.' + this.file.data.attributes.ext
            },
            lastModified () {
                return Math.floor(this.file.data.attributes.last_modified * 1000)
            }
        },
        created () {
            this.fetchData()
        },
        watch: {
            '$route': 'fetchData'
        },
        methods: {
            updateTaxonomies (taxonomy, oC) {
                let _vm = this
                return (nC) => {
                    oC = nC
                    _vm.file.data.attributes.frontMatter[taxonomy.toLowerCase()] = nC
                }
            },
            fileDate () {
                if (this.file.data.attributes.frontMatter.date) {
                    return Math.floor(this.file.data.attributes.frontMatter.date * 1000)
                }
                return Math.floor(this.file.data.attributes.date * 1000)
            },
            isPublished () {
                // Is not published if draft = true
                // Is not published if draft = false && date in future
                let publishDate = this.file.data.attributes.frontMatter.date
                if (publishDate) {
                    let date = Math.floor(new Date(publishDate * 1000).getTime() / 1000)
                    let now = Math.floor(Date.now() / 1000)

                    if (this.file.data.attributes.frontMatter.draft === true) {
                        return false
                    }
                    if (this.file.data.attributes.frontMatter.draft === false && date > now) {
                        return false
                    }
                }
                return !this.file.data.attributes.frontMatter.draft
            },
            isScheduled () {
                // Is scheduled if draft = false && date in future
                let publishDate = this.file.data.attributes.frontMatter.date
                if (!publishDate) {
                    return false
                }
                let date = Math.floor(new Date(publishDate * 1000).getTime() / 1000)
                let now = Math.floor(Date.now() / 1000)

                if (this.file.data.attributes.frontMatter.draft === false && date > now) {
                    return true
                }
                return false
            },
            isDraft () {
                // Is a draft if draft = true && date in past
                // Or if date doesn't exist the valule of draft is used
                let publishDate = this.file.data.attributes.frontMatter.date
                if (typeof publishDate === 'undefined') {
                    return this.file.data.attributes.frontMatter.draft
                }

                let date = Math.floor(new Date(publishDate * 1000).getTime() / 1000)
                let now = Math.floor(Date.now() / 1000)
                if (this.file.data.attributes.frontMatter.draft === true && date < now) {
                    return true
                }

                return false
            },
            displaySchedule () {
                if (this.isScheduled()) {
                    console.log('is scheduled')
                }
                this.settingSchedule = true
            },
            hideSchedule () {
                this.settingSchedule = false
            },
            schedule () {
                this.file.data.attributes.frontMatter.draft = false
                this.file.data.attributes.frontMatter.date = 1513036800
                this.settingSchedule = false
            },
            cancelSchedule () {
                this.settingSchedule = false
                this.scheduleTime = null
                this.file.data.attributes.frontMatter.draft = true
                this.file.data.attributes.frontMatter.date = null
            },
            publish () {
                this.settingSchedule = false
                this.file.data.attributes.frontMatter.draft = false
                this.file.data.attributes.frontMatter.date = Math.floor(Date.now() / 1000)
            },
            unpublish () {
                this.settingSchedule = false
                this.file.data.attributes.frontMatter.draft = true
                this.file.data.attributes.frontMatter.date = null
            },
            saveChanges () {
                let _vm = this
                this.isSaving = true
                this.$setProjectFile(this.file).then((response) => {
                    _vm.file = response.data
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
                let tempFile
                this.$getProjectFile().then((response) => {
                    let f = response.data
                    let mode = CodeMirrorMeta.findModeByExtension(f.data.attributes.ext)
                    if (mode) {
                        _vm.editorOption.mode.name = mode.mode
                    }
                    tempFile = f
                    return _vm.$getProjectContentType()
                }).then((response) => {
                    let taxonomies = response.data.data.attributes.taxonomies
                    if (taxonomies) {
                        let tmp = {}
                        for (let i = 0; i < taxonomies.length; i++) {
                            let fileClassifications = tempFile.data.attributes.frontMatter[taxonomies[i]]
                            if (!fileClassifications) {
                                tempFile.data.attributes.frontMatter[taxonomies[i]] = []
                            }
                            tmp[capitalize(taxonomies[i])] = (JSON.parse(JSON.stringify(fileClassifications)))
                        }
                        _vm.taxonomies = tmp
                    }
                    _vm.file = tempFile
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
