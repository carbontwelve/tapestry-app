<template>
    <div class="container" style="width: 500px">
        <div class="card">
            <header class="card-header">
                <p class="card-header-title">
                    Installation Wizard
                </p>
            </header>
            <div class="card-content">
                <div class="content" v-if="(stage==='auth' || stage==='api')">
                    <p>
                        Welcome to Tapestry, before we can begin I need to know what API endpoint you would like to use:
                    </p>
                    <api-url-input v-on:completed="setSite" :isEnabled="(stage==='api')"></api-url-input>
                    <hr v-if="(stage==='auth')">
                    <api-authenticate v-on:completed="setSite" :url="api.url" :isEnabled="(stage==='auth')" v-if="(stage==='auth')"></api-authenticate>
                </div>
                <div class="content" v-if="(stage==='create-project')">
                    <p>
                        It looks like you do not have any website projects configured, lets create one now:
                    </p>
                    <name-input v-on:completed="setProject"></name-input>
                </div>
                <div class="content" v-if="(stage==='select-project')">
                    <p>
                        You have {{ totalProjects() }} projects configured, please select one to begin working on from the drop down below:
                    </p>
                    <project-select-input :projects="projects.all"  v-on:completed="setCurrentProject"></project-select-input>
                </div>

                <div class="content" v-if="(stage==='sync')">
                    <p class="has-text-centered">
                        Creating project and syncing with API
                    </p>
                    <p class="has-text-centered">
                        <span class="icon">
                            <i class="fa fa-spin fa-spinner" aria-hidden="true"></i>
                        </span>
                    </p>
                </div>
            </div>
            <footer class="card-footer">
                <a class="card-footer-item" :class="{'is-disabled': !canContinue}" :disabled="!canContinue" @click="nextStage">Continue</a>
            </footer>
            <progress class="animated progress is-small is-card-footer" :value="percentageComplete" max="100">{{ percentageComplete + '%'}}</progress>
        </div>
    </div>
</template>

<script type="text/babel">
    import Api from '../models/api'
    import {mapState, mapActions, mapGetters} from 'vuex'
    import ApiUrlInput from '../components/api/ApiUrlinput.vue'
    import ApiAuthenticate from '../components/api/ApiAuthenticate.vue'
    import NameInput from '../components/project/NameInput.vue'
    import ProjectSelectInput from '../components/project/ProjectSelectInput.vue'

    export default {
        name: 'install',
        computed: mapState(['projects']),
        data () {
            return {
                msg: 'Install Window',
                stage: 'api',
                canContinue: false,
                api: new Api({name: 'Unnamed'}),
                projectName: '',
                selectedProject: 0,
                percentageComplete: 0
            }
        },
        components: {
            ApiUrlInput,
            ApiAuthenticate,
            NameInput,
            ProjectSelectInput
        },
        created () {
            if (this.isInstalled()) {
                this.$router.replace('dashboard')
                return
            }
        },
        mounted () {
            if (!this.isInstalling()) {
                this.setInstalling(true)
                return
            }
            if (this.totalApiEndpoints() > 0 && this.hasSelectedApiEndpoint()) {
                this.percentageComplete = 66
                if (this.totalProjects() > 0) {
                    this.stage = 'select-project'
                    return
                }
                this.stage = 'create-project'
            }
        },
        methods: {
            ...mapGetters([
                'isInstalling',
                'isInstalled',
                'totalApiEndpoints',
                'hasSelectedApiEndpoint'
            ]),
            ...mapActions([
                'toggleSidebar',
                'setInstalling',
                'setInstalled',
                'setSelectedProjectById'
            ]),
            totalProjects () {
                return this.projects.all.length
            },
            completeInstall () {
                this.setInstalling(false)
                this.setInstalled(true)
                this.$router.replace('dashboard')
            },
            nextStage () {
                let _vm = this
                this.canContinue = false
                if (this.stage === 'api') {
                    this.stage = 'auth'
                    this.percentageComplete = 33
                    return
                }
                if (this.stage === 'auth') {
                    this.$store.dispatch('addApiEndpoint', this.api)
                    Promise.all(this.$syncProjects()).then(() => {
                        _vm.stage = 'select-project'
                        _vm.percentageComplete = 66
                        return
                    })
                    return
                }
                if (this.stage === 'create-project') {
                    this.stage = 'sync'
                    let _self = this
                    this.percentageComplete = 100
                    this.axios.post('projects', {
                        name: _self.projectName,
                        clone: 'default'
                    }).then((response) => {
                        console.log(response)
                        _vm.completeInstall()
                    }).catch((error) => {
                        if (error.message) {
                            // @todo something intelligent with the error
                            // _self.errorMsg = error.message
                            return
                        }
                    })
                }
                if (this.stage === 'select-project') {
                    this.percentageComplete = 100
                    this.setSelectedProjectById(this.selectedProject)
                    this.completeInstall()
                }
            },
            setSite (payload) {
                if (this.stage === 'api') {
                    this.api.name = payload.url
                    this.api.url = payload.url
                    this.api.api.jsonApiVersion = payload.jsonApiVersion
                    this.api.api.tapestryVersion = payload.tapestryVersion
                    this.canContinue = true
                }

                if (this.stage === 'auth') {
                    this.api.setJWT(payload.jwt)
                    this.canContinue = true
                }
            },
            setProject (payload) {
                this.canContinue = true
                this.projectName = payload.name
            },
            setCurrentProject (payload) {
                if (payload.selected === 'default') {
                    this.canContinue = false
                    this.selectedProject = 0
                    return
                }
                this.canContinue = true
                this.selectedProject = payload.selected
            }
        }
    }
</script>

<style>
    a.card-footer-item.is-disabled{
        opacity: 0.5;
    }
    progress.is-card-footer{
        position: absolute;
        bottom: -2px;
        z-index: -1;
    }
</style>