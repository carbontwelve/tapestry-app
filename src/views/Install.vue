<template>
    <div class="container" style="width: 500px">
        <div class="card">
            <header class="card-header">
                <p class="card-header-title">
                    Installation Wizard
                </p>
                <a class="card-header-icon">
                  <span class="icon">
                    <i class="fa fa-angle-down"></i>
                  </span>
                </a>
            </header>
            <div class="card-content">
                <div class="content">
                    <p>
                        Welcome to Tapestry, before we can begin I need to know what API endpoint you would like to use:
                    </p>
                    <api-url-input v-on:completed="setSite" :isEnabled="(stage==='api')"></api-url-input>
                    <hr v-if="(stage==='auth')">
                    <api-authenticate v-on:completed="setSite" :url="site.url" :isEnabled="(stage==='auth')" v-if="(stage==='auth')"></api-authenticate>
                </div>
            </div>
            <footer class="card-footer">
                <a class="card-footer-item" :class="{'is-disabled': !canContinue}" :disabled="!canContinue" @click="nextStage">Continue</a>
            </footer>
        </div>
    </div>
</template>

<script type="text/babel">
    import Site from '../models/site'
    import {mapActions} from 'vuex'
    import ApiUrlInput from '../components/api/ApiUrlinput.vue'
    import ApiAuthenticate from '../components/api/ApiAuthenticate.vue'

    export default {
        data () {
            return {
                msg: 'Install Window',
                stage: 'api',
                canContinue: false,
                site: new Site({name: 'Unnamed'})
            }
        },
        components: {
            ApiUrlInput,
            ApiAuthenticate
        },
        methods: {
            ...mapActions([
                'toggleSidebar'
            ]),
            nextStage: function () {
                this.canContinue = false
                if (this.stage === 'api') {
                    this.stage = 'auth'
                    return
                }
                if (this.stage === 'auth') {
                    this.$store.dispatch('addSite', this.site)
                    this.$store.dispatch('setInstalled', true)
                }
            },
            setSite: function (payload) {
                if (this.stage === 'api') {
                    this.site.name = payload.url
                    this.site.url = payload.url
                    this.site.api.jsonApiVersion = payload.jsonApiVersion
                    this.site.api.tapestryVersion = payload.tapestryVersion
                    this.canContinue = true
                }

                if (this.stage === 'auth') {
                    this.site.setJWT(payload.jwt)
                    this.canContinue = true
                }
                console.log(this.site)
            }
        }
    }
</script>

<style>
    a.card-footer-item.is-disabled{
        opacity: 0.5;
    }
</style>