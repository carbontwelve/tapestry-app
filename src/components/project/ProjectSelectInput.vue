<template>
    <!-- Project Select -->
    <div class="project-select-input">

        <label class="label">Project</label>
        <p class="control">
            <span class="select is-fullwidth">
                <select class="is-fullwidth" v-model="selected" @change="validateSelected">
                    <option value="default">Select Project</option>
                    <template v-for="project in projects">
                        <option :value="project.id">{{ project.name }}</option>
                    </template>
                </select>
            </span>
        </p>
    </div>
    <!-- ./ project select -->
</template>

<script type="text/babel">
    export default {
        name: 'project-select-input',
        props: {
            projects: {
                type: Array,
                default: []
            }
        },
        data: function () {
            return {
                selected: 'default'
            }
        },
        methods: {
            validateSelected () {
                this.$emit('completed', {
                    selected: this.selected
                })
            }
        }
    }
</script>