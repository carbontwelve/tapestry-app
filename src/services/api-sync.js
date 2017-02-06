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

    Vue.prototype.$syncProject = function () {
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
                        new MenuItem({title: 'Content', route: {name: 'ContentTypeContent', params: {contentType: d.data[i].attributes.name}}}),
                        ...taxonomies
                    ]
                }))
                console.log(menu)
            }
            console.log('end')
            this.$store.dispatch('setMenuItems', menu)
        }).catch(() => {
            // @todo catch error and do something intelligent
        })
    }
}

export default apiSync
