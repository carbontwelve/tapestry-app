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
                <div class="content" v-if="(stage==='project')">
                    <p>
                        It looks like you do not have any website projects configured, lets create one now:
                    </p>
                    <name-input v-on:completed="setProject"></name-input>
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
            <progress class="progress is-small is-card-footer" :value="percentageComplete" max="100">{{ percentageComplete + '%'}}</progress>
        </div>
    </div>
</template>

<script type="text/babel">
    import Api from '../models/api'
    import {mapActions, mapGetters} from 'vuex'
    import ApiUrlInput from '../components/api/ApiUrlinput.vue'
    import ApiAuthenticate from '../components/api/ApiAuthenticate.vue'
    import NameInput from '../components/project/NameInput.vue'

    export default {
        data () {
            return {
                msg: 'Install Window',
                stage: 'api',
                canContinue: false,
                api: new Api({name: 'Unnamed'}),
                projectName: '',
                percentageComplete: 0
            }
        },
        components: {
            ApiUrlInput,
            ApiAuthenticate,
            NameInput
        },
        mounted () {
            if (!this.isInstalling()) {
                this.setInstalling(true)
                return
            }
            if (this.totalApiEndpoints() > 0 && this.hasSelectedApiEndpoint()) {
                this.stage = 'project'
                this.percentageComplete = 66
            }
        },
        methods: {
            ...mapGetters([
                'isInstalling',
                'totalApiEndpoints',
                'hasSelectedApiEndpoint'
            ]),
            ...mapActions([
                'toggleSidebar',
                'setInstalling'
            ]),
            nextStage: function () {
                this.canContinue = false
                if (this.stage === 'api') {
                    this.stage = 'auth'
                    this.percentageComplete = 33
                    return
                }
                if (this.stage === 'auth') {
                    this.$store.dispatch('addApiEndpoint', this.api)
                    // this.$store.dispatch('setInstalled', true)
                    this.stage = 'project'
                    this.percentageComplete = 66
                }
                if (this.stage === 'project') {
                    this.stage = 'sync'
                    this.percentageComplete = 100
                }
            },
            setSite: function (payload) {
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
            setProject: function (payload) {
                this.canContinue = true
                this.projectName = payload.name
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