<template>
    <div>
        <table class="table">
            <thead>
            <tr>
                <th><abbr title="Site Name">Site Name</abbr></th>
                <th style="width: 10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="sites.all.length < 1">
                <td colspan="2">You have no sites set.</td>
            </tr>
            <tr v-for="item in sites.all">
                <td>
                    <input name="selected" type="radio" :checked="isSelected(item)" value="1" @click="setSelected(item)" />
                    {{ item.name }}
                </td>
                <td class="control">
                    <a class="button is-small">
                        <span class="icon is-small">
                          <i class="fa fa-pencil-square-o"></i>
                        </span>
                    </a>
                    <a class="button is-danger is-small" @click="deleteSite(item)">
                        <span class="icon is-small">
                          <i class="fa fa-trash-o"></i>
                        </span>
                    </a>
                </td>
            </tr>
            </tbody>
        </table>

        <a class="button" @click="addSite">Add Site</a>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'

    export default {
        name: 'Home',
        data () {
            return {
                msg: 'This is the landing page...'
            }
        },
        computed: {
            ...mapState(['sites']),
            ...mapActions([])
        },
        methods: {
            addSite: function () {
                this.$store.dispatch('addSite', {name: 'Hello world ' + this.sites.all.length})
            },
            deleteSite: function (site) {
                this.$store.dispatch('removeSite', site)
            },
            isSelected: function (site) {
                if (this.sites.selected && site.name === this.sites.selected.name) {
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