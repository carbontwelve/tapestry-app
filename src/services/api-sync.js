import Project from '../models/project'
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
                if (d.data && d.data.projects) {
                    for (let i = 0; i < d.data.projects.length; i++) {
                        let project = new Project(d.data.projects[i])
                        project.siteUUID = apiEndpoint.uuid
                        _vm.$store.dispatch('addProject', project)
                    }
                }
            }).catch(() => {
                // @todo catch error and do something intelligent
            }))
        }
        return promises
    }
}

export default apiSync
