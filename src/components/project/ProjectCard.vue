<template>
    <div class="column is-half-mobile is-one-third-tablet is-one-third-desktop">
        <div class="card is-fullwidth">
            <header class="card-header">
                <p class="card-header-title">
                    <span class="flex grow">{{ project.name }}</span>
                    <span class="tag is-primary" v-if="isSelected">Selected</span>
                </p>

            </header>
            <div class="card-content">
                <div class="content">
                    <div style="width: 100%; height: 250px; background: #c2c2c2; text-align: center; padding: 115px 0">
                        &lt;Preview Image&gt;
                    </div>
                </div>
            </div>
            <footer class="card-footer">
                <a class="card-footer-item" @click="setSelected">{{ (isSelected) ? 'Selected' : 'Select' }}</a>
            </footer>
        </div>
    </div>
</template>

<script type="text/babel">
    import Project from '../../models/project'
    export default {
        name: 'project-card',
        props: {
            project: {
                type: Project,
                required: true
            }
        },
        computed: {
            isSelected () {
                return this.project.id === this.$store.getters.getSelectedProject.id
            }
        },
        methods: {
            setSelected () {
                this.$store.dispatch('setSelectedProject', this.project)
            }
        }
    }
</script>