<template>
    <!-- API URL -->
    <div class="api-url-input">
        <div class="control is-horizontal">
            <div class="control-label"><label class="label">API URL</label></div>
            <p class="control has-icon has-icon-right">
                <input class="input" type="text" :class="{'is-danger': isError, 'is-success': isSuccess}" placeholder="http://api.example.com" :disabled="!isEnabled" v-model="url" @change="checkAPI" />
                <span class="icon is-small">
                    <i class="fa fa-spinner fa-spin" v-if="isLoading"></i>
                    <i class="fa fa-warning" v-if="isError"></i>
                    <i class="fa fa-check" v-if="isSuccess"></i>
                </span>
            </p>
        </div>

        <div class="control is-horizontal" v-if="isError && errorMsg.length > 0">
            <div class="control-label">&nbsp;</div>
            <p class="control">
                <span class="help is-danger">{{ errorMsg }}</span>
            </p>
        </div>
    </div>
    <!-- ./ API URL -->
</template>

<script type="text/babel">
    import validate from 'validate.js'
    import axios from 'axios'
    export default {
        name: 'api-url-input',
        props: {
            isEnabled: {
                type: Boolean,
                default: () => false
            }
        },
        data: function () {
            return {
                url: '',
                errorMsg: '',
                isLoading: false,
                isError: false,
                isSuccess: false
            }
        },
        methods: {
            checkAPI: function () {
                this.isError = false
                this.isSuccess = false

                var validation = validate({API_URL: this.url}, {API_URL: {url: true}})
                if (validation && validation.API_URL) {
                    // @todo this doesn't support usage of port numbers in urls
                    // this.isError = true
                    // this.errorMsg = validation.API_URL[0]
                    // return
                }
                this.isLoading = true
                var _self = this

                var ajax = axios.create({
                    baseURL: this.url
                })
                ajax.get('handshake').then((response) => {
                    var d = response.data
                    if (d.jsonapi && d.jsonapi.version && d.data && d.data.tapestryVersion) {
                        _self.isLoading = false
                        _self.isSuccess = true
                        _self.$emit('completed', {
                            url: _self.url,
                            jsonApiVersion: d.jsonapi.version,
                            tapestryVersion: d.data.tapestryVersion
                        })
                        return
                    }
                    _self.errorMsg = 'An unknown error happened, oops.'
                }).catch(function () {
                    _self.isError = true
                    _self.isLoading = false
                    _self.errorMsg = 'Tapestry API could not be found at the URL you provided.'
                })
            }
        }
    }
</script>