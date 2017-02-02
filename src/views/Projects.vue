<template>
    <div class="projects">
        <div class="columns is-multiline">
            <template v-for="project in projects.all">
                <project-card :project="project"></project-card>
            </template>
        </div>
    </div>
</template>

<script type="text/babel">
    import ProjectCard from '../components/project/ProjectCard'
    import {mapState} from 'vuex'
    export default {
        name: 'projects',
        components: {
            ProjectCard
        },
        computed: {
            ...mapState(['projects'])
        }
    }
</script>