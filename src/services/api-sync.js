import Project from '../models/project'
import MenuItem from '../models/MenuItem'
import {capitalize} from '../strings'
const apiSync = {}

apiSync.install = function (Vue) {
    Vue.prototype.$syncProjects = function () {
        let promises = []
        let _vm = this
        let apiEndpoints = this.$store.getters.listApiEndpoints
        for (let apiKey = 0; apiKey < apiEndpoints.length; apiKey++) {
            let apiEndpoint = apiEndpoints[apiKey]
            console.log('Syncing Projects with [' + apiEndpoint.url + ']')
            promises.push(this.axios({
                method: 'get',
                baseURL: apiEndpoint.url,
                url: 'projects'
            }).then((response) => {
                let d = response.data
                let projects = []
                if (d.data && d.data.projects) {
                    for (let i = 0; i < d.data.projects.length; i++) {
                        let project = new Project(d.data.projects[i])
                        project.siteUUID = apiEndpoint.uuid
                        projects.push(project)
                    }
                }
                _vm.$store.dispatch('syncWithAPI', projects)
            }).catch(() => {
                // @todo catch error and do something intelligent
            }))
        }
        return promises
    }

    Vue.prototype.$getProject = function () {
        let selectedProject = this.$store.getters.getSelectedProject
        console.log('Syncing Project [' + selectedProject.id + ']')
        return this.axios({
            method: 'get',
            url: 'project/' + selectedProject.id + '/content-types'
        }).then((response) => {
            let d = response.data
            let menu = []

            menu.push(new MenuItem({
                title: 'Dashboard',
                route: 'Dashboard',
                meta: {
                    icon: 'fa-dashboard'
                }
            }))

            for (let i = 0; i <= d.data.length - 1; i++) {
                let attr = d.data[i].attributes
                let taxonomies = []
                if (attr.taxonomies.length > 0) {
                    for (let taxonomyKey = 0; taxonomyKey <= attr.taxonomies.length - 1; taxonomyKey++) {
                        taxonomies.push(new MenuItem({
                            title: capitalize(attr.taxonomies[taxonomyKey]),
                            route: {name: 'ContentTypeTaxonomy', params: {contentType: d.data[i].attributes.name, taxonomy: attr.taxonomies[taxonomyKey]}}
                        }))
                    }
                }

                menu.push(new MenuItem({
                    title: capitalize(attr.name),
                    route: null,
                    meta: {
                        'api': d.data[i].links.self,
                        'icon': 'fa-folder-o'
                    },
                    children: [
                        new MenuItem({title: 'Content', route: {name: 'ContentTypeContent', params: {contentType: d.data[i].attributes.name}}, meta: {api: d.data[i].links.self}}),
                        ...taxonomies
                    ]
                }))
            }

            this.$store.dispatch('setMenuItems', menu)
        }).then(() => {
            console.log('Syncing Workspace Content Types [' + selectedProject.id + '/content-types]')
            return this.axios({
                method: 'get',
                url: 'project/' + selectedProject.id + '/content-types'
            })
        }).then((response) => {
            this.$store.dispatch('setWSContentTypePayload', response.data)
        }).then(() => {
            console.log('Syncing Workspace Files [' + selectedProject.id + '/files]')
            return this.axios({
                method: 'get',
                url: 'project/' + selectedProject.id + '/files'
            })
        }).then((response) => {
            this.$store.dispatch('setWSFilesPayload', response.data)
        }).catch(() => {
            // @todo catch error and do something intelligent with it
        })
    }

    Vue.prototype.$getProjectContentType = function () {
        let selectedProject = this.$store.getters.getSelectedProject
        console.log('Getting Content Type [' + selectedProject.id + '/' + this.$route.params.contentType + ']')
        let ajaxPath = 'project/' + selectedProject.id + '/content-types/' + this.$route.params.contentType
        return this.axios({
            method: 'get',
            url: ajaxPath
        }).catch((err) => {
            window.alert(err.message)
            throw err
        })
    }

    Vue.prototype.$getProjectFile = function () {
        let selectedProject = this.$store.getters.getSelectedProject
        console.log('Getting File [' + selectedProject.id + '/' + this.$route.params.contentType + '/' + this.$route.params.file + ']')
        let ajaxPath = 'project/' + selectedProject.id + '/file/' + this.$route.params.file
        return this.axios({
            method: 'get',
            url: ajaxPath
        }).catch((err) => {
            window.alert(err.message)
            throw err
        })
    }

    Vue.prototype.$setProjectFile = function (f) {
        // A file will only contain a link to self if it exists, we can PUT to this end point to update
        // Otherwise we need to POST to /project/{projectUUID}/file
        let config = {
            method: 'post',
            url: '',
            data: {
                file: f
            }
        }

        if (f.links && f.links.self) {
            config.method = 'put'
            config.url = f.links.self
        } else {
            let selectedProject = this.$store.getters.getSelectedProject
            config.url = 'project/' + selectedProject.id + '/file'
        }

        return this.axios(config).catch((err) => {
            window.alert(err.message)
            throw err
        })
    }
}

export default apiSync
