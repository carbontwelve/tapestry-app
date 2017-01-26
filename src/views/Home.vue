<template>
    <div>
        <table class="table">
            <thead>
            <tr>
                <th><abbr title="Site name">Project</abbr></th>
                <th width="200"><abbr title="Created date" class="has-text-centered is-block">Created</abbr></th>
                <th width="100"><abbr title="Available actions" class="has-text-centered is-block">Actions</abbr></th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="sites.all.length < 1">
                <td colspan="3">You have no sites set.</td>
            </tr>
            <tr v-for="item in sites.all">
                <td class="control">
                    <label class="radio">
                        <input name="selected" type="radio" :checked="isSelected(item)" @click="setSelected(item)" />
                        {{ item.name }}
                    </label>
                </td>
                <td class="has-text-centered">
                    {{ item.getCreatedDate() }}
                </td>
                <td class="control has-text-centered">
                    <a class="button is-small" @click="editSite(item)">
                        <span class="icon is-small">
                          <i class="fa fa-pencil-square-o"></i>
                        </span>
                    </a>
                    <a class="button is-danger is-small" :disabled="isSelected(item)" @click="deleteSite(item)">
                        <span class="icon is-small">
                          <i class="fa fa-trash-o"></i>
                        </span>
                    </a>
                </td>
            </tr>
            </tbody>
        </table>

        <a class="button" @click="addSite">Add Site</a>

        <site-form></site-form>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import Site from '../models/site'
    import SiteForm from '../components/site/SiteForm'

    export default {
        name: 'Home',
        data () {
            return {
                msg: 'This is the landing page...'
            }
        },
        computed: {
            ...mapState(['sites'])
        },
        components: {
            SiteForm
        },
        methods: {
            addSite: function () {
                this.$store.dispatch('addSite', new Site({name: 'Hello world ' + this.sites.all.length}))
            },
            editSite: function (site) {
                window.alert(site.hash)
            },
            deleteSite: function (site) {
                this.$store.dispatch('removeSite', site)
            },
            isSelected: function (site) {
                if (this.sites.selected && site.hash === this.sites.selected.hash) {
                    return true
                }
                return false
            },
            setSelected: function (site) {
                this.$store.dispatch('setSelected', site)
            }
        }
    }
</script>