<template>
    <div id="content">
        <loading-screen :loading="isLoading" loadingText="Syncing with API" inside>
            <nav class="nav">
                <div class="nav-right">
                    <span class="nav-item">
                      <a class="button is-primary">
                        <span class="icon">
                          <i class="fa fa-plus" aria-hidden="true"></i>
                        </span>
                        <span>Create New</span>
                      </a>
                    </span>
                </div>
            </nav>
            <br>
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title">
                        Component
                    </p>
                    <a class="card-header-icon">
                      <span class="icon">
                        <i class="fa fa-angle-down"></i>
                      </span>
                    </a>
                </header>
                <div class="card-content">
                    <div class="content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                        <a>@bulmaio</a>. <a>#css</a> <a>#responsive</a>
                        <br>
                        <small>11:09 PM - 1 Jan 2016</small>
                    </div>
                </div>
                <footer class="card-footer">
                    <a class="card-footer-item">Save</a>
                    <a class="card-footer-item">Edit</a>
                    <a class="card-footer-item">Delete</a>
                </footer>
            </div>
        </loading-screen>
    </div>
</template>

<script>
    import LoadingScreen from '../components/layout/LoadingScreen'
    export default {
        name: 'ContentTypeContent',
        data () {
            return {
                isLoading: true,
                content: []
            }
        },
        components: {
            LoadingScreen
        },
        created () {
            this.fetchData()
        },
        watch: {
            '$route': 'fetchData'
        },
        methods: {
            fetchData () {
                let _vm = this
                let selectedProject = this.$store.getters.getSelectedProject
                console.log('Getting Content Type for Project [' + selectedProject.id + '/' + this.$route.params.contentType + ']')
                let ajaxPath = 'project/' + selectedProject.id + '/content-types/' + this.$route.params.contentType
                this.axios({
                    method: 'get',
                    url: ajaxPath
                }).then((response) => {
                    let d = response.data
                    console.log(d)
                    _vm.isLoading = false
                    _vm.content = d.data.attributes.files
                })
            }
        }
    }
</script>