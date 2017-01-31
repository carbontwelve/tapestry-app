<template>
    <!-- API Authentication -->
    <div class="api-authentication">
        <div class="control is-horizontal">
            <div v-if="showLabel" class="control-label"><label class="label">Authentication</label></div>
            <div class="control is-grouped">
                <p class="control is-expanded">
                    <input type="text" placeholder="Username" class="input" v-model="username" :disabled="isLoading" :class="{'is-danger': isError, 'is-success': isSuccess}"/>
                </p>
                <p class="control is-expanded">
                    <input type="password" placeholder="Password" class="input" v-model="password" :disabled="isLoading" :class="{'is-danger': isError, 'is-success': isSuccess}" @keyup.enter="authenticate"/>
                </p>
            </div>
        </div>

        <div class="control is-horizontal" v-if="isError">
            <div class="control-label">&nbsp;</div>
            <p class="control">
                <span class="help is-danger">{{ errorMsg }}</span>
            </p>
        </div>
    </div>
    <!-- ./ API Authentication -->
</template>

<script type="text/babel">
    import axios from 'axios'
    export default {
        name: 'api-authenticate',
        props: {
            isEnabled: {
                type: Boolean,
                default: () => false
            },
            showLabel: {
                type: Boolean,
                default: () => false
            },
            url: {
                type: String,
                required: true
            }
        },
        data: function () {
            return {
                username: '',
                password: '',
                errorMsg: '',
                isLoading: false,
                isError: false,
                isSuccess: false
            }
        },
        methods: {
            authenticate: function () {
                this.isLoading = true
                this.isError = false
                this.isSuccess = false

                var _self = this
                var ajax = axios.create({
                    baseURL: this.url
                })

                ajax.post('authenticate', {
                    username: _self.username,
                    password: _self.password
                }).then((response) => {
                    _self.isLoading = false
                    _self.isSuccess = true
                    var d = response.data
                    if (d.jsonapi && d.data && d.data.jwt) {
                        _self.$emit('completed', {
                            jwt: d.data.jwt
                        })
                    }
                }).catch(function (error) {
                    _self.isError = true
                    _self.isLoading = false
                    if (error.response && error.response.status === 401) {
                        _self.errorMsg = 'The username or password supplied is incorrect, please try again.'
                        return
                    }
                    if (error.message) {
                        _self.errorMsg = error.message
                        return
                    }
                    _self.errorMsg = 'An unknown error happened while communicating with the API.'
                })
            }
        }
    }
</script>