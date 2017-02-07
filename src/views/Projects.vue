<template>
    <div class="projects">
        <nav class="nav">
            <div class="nav-right">
                <span class="nav-item">
                    <router-link :to="{name:'InitProject'}" class="button is-primary" exact>
                        <span class="icon">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                        </span>
                        <span>Initiate Project</span>
                    </router-link>
                </span>
            </div>
        </nav>

        <br>

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