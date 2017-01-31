<template>
    <!-- Project Name -->
    <div class="project-name-input">
        <div class="control is-horizontal">
            <div class="control-label"><label class="label">Name</label></div>
            <p class="control has-icon has-icon-right">
                <input class="input" type="text" :class="{'is-danger': isError, 'is-success': isSuccess}" placeholder="Untitled" v-model="name" @change="validateName" />
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
    <!-- ./ project name -->
</template>

<script type="text/babel">
    import validate from 'validate.js'
    export default {
        name: 'name-input',
        data: function () {
            return {
                name: '',
                errorMsg: '',
                isLoading: false,
                isError: false,
                isSuccess: false
            }
        },
        methods: {
            validateName () {
                this.isError = false
                this.isSuccess = false
                var validation = validate({PROJECT_NAME: this.name}, {PROJECT_NAME: {length: {minimum: 1, maximum: 250}}})
                if (validation && validation.PROJECT_NAME) {
                    this.isError = true
                    this.errorMsg = validation.PROJECT_NAME[0]
                    return
                }

                this.isLoading = true
                var _self = this
                this.axios.post('projects/check', {
                    name: this.name
                }).then((response) => {
                    _self.isLoading = false
                    var d = response.data
                    if (d.data.exists === false) {
                        _self.isSuccess = true
                        _self.$emit('completed', {
                            name: this.name
                        })
                        return
                    }
                    _self.isError = true
                    _self.errorMsg = 'A project with an identical name already exists.'
                }).catch(function (error) {
                    _self.isError = true
                    _self.isLoading = false
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