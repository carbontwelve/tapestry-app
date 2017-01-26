<template>
    <div class="tile is-ancestor">
        <div class="tile is-parent">
            <article class="tile is-child box"><h1 class="title">Site</h1>
                <div class="block">
                    <!-- API URL -->
                    <div class="control is-horizontal">
                        <div class="control-label"><label class="label">API URL</label></div>
                        <p class="control has-icon has-icon-right">
                            <input class="input" type="text" :class="{'is-danger': apiError, 'is-success': validUrl}" placeholder="http://api.example.com" :disabled="stage!='api_url'" v-model="site.url" @change="checkAPI" />
                            <span class="icon is-small">
                                <i class="fa fa-spinner fa-spin" v-if="loadingApiUrl"></i>
                                <i class="fa fa-warning" v-if="apiError"></i>
                                <i class="fa fa-check" v-if="validUrl"></i>
                            </span>
                        </p>
                    </div>

                    <div class="control is-horizontal" v-if="apiError">
                        <div class="control-label">&nbsp;</div>
                        <p class="control">
                            <span class="help is-danger">{{ apiError }}</span>
                        </p>
                    </div>
                    <!-- ./ API URL -->

                    <div class="control is-horizontal" v-if="validUrl">
                        <div class="control-label">&nbsp;</div>
                        <div class="control">
                            <div class="panel is-full-width">
                                <p class="panel-heading">
                                    Website Details
                                </p>
                                <div class="panel-block">
                                    <p><strong>Tapestry:</strong> {{ site.api.tapestryVersion }}</p>

                                </div>
                                <div class="panel-block">
                                    <p><strong>Site Name</strong>: {{ site.name }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- API Authentication -->
                    <div class="control is-horizontal" v-if="validUrl">
                        <div class="control-label"><label class="label">Authentication</label></div>
                        <div class="control is-grouped">
                            <p class="control is-expanded has-icon has-icon-right">
                                <input type="text" placeholder="Username" class="input" v-model="authDetails.username" :disabled="loadingAuthUrl"/>
                                <span class="icon is-small">
                                    <i class="fa fa-check"></i>
                                </span>
                            </p>
                            <p class="control is-expanded has-icon has-icon-right">
                                <input type="password" placeholder="Password" class="input" v-model="authDetails.password" :disabled="loadingAuthUrl" @keyup.enter="submitForm"/>
                                <span class="icon is-small">
                                    <i class="fa fa-check"></i>
                                </span>
                            </p>
                        </div>
                    </div>
                    <!-- ./ API Authentication -->

                    <div class="control is-horizontal">
                        <div class="control-label"><label class="label"></label></div>
                        <div class="control">
                            <button :class="{'is-loading': loadingAuthUrl}" class="button is-primary" :disabled="!canSave" @click="submitForm">Save</button>
                            <button class="button is-link">Cancel</button>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>

<script type="text/babel">
    import Site from '../../models/site'
    import validate from 'validate.js'
    export default {
        name: 'site-form',
        data: function () {
            return {
                stage: 'api_url',
                site: new Site({}),
                authDetails: {username: '', password: ''},
                validUrl: false,
                loadingApiUrl: false,
                loadingAuthUrl: false,
                apiError: '',
                authError: ''
            }
        },
        computed: {
            canSave: function () {
                return this.authDetails.username.length > 0 && this.authDetails.password.length > 0
            }
        },
        methods: {
            checkAPI: function () {
                this.apiError = ''
                this.validUrl = false

                var validation = validate({API_URL: this.site.url}, {API_URL: {url: true}})
                if (validation && validation.API_URL) {
                    // this.apiError = validation.API_URL[0]
                    // return
                }

                this.loadingApiUrl = true
                Promise.resolve(this.site.apiHandshake()).then((d) => {
                    if (d.err !== null) {
                        this.apiError = 'Tapestry API could not be found at the URL you provided.'
                        this.loadingApiUrl = false
                        return
                    }

                    if (d.data.jsonapi && d.data.jsonapi.version && d.data && d.data.data.tapestryVersion) {
                        this.stage = 'auth'
                        this.validUrl = true
                        this.loadingApiUrl = false
                        this.site.name = d.data.data.siteName
                        this.site.api.jsonApiVersion = d.data.jsonapi.version
                        this.site.api.tapestryVersion = d.data.data.tapestryVersion
                    }
                })
            },
            submitForm: function () {
                if (!this.canSave) {
                    return
                }
                this.loadingAuthUrl = true
                Promise.resolve(this.site.authenticate(this.authDetails)).then((d) => {
                    console.log(d)
                })
            }
        }
    }
</script>