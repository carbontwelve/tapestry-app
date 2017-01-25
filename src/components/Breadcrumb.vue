<template>
    <ol class="breadcrumb">
        <li v-for="item, index in list">
            <span class="active" v-if="isLast(index)">{{item.name}}</span>
            <router-link :to="item.name" active-class="is-active-crumb" v-else>
                {{item.name}}
            </router-link>
        </li>
    </ol>
</template>

<script type="text/babel">
    export default {
        props: {
            list: {
                type: Array,
                required: true,
                default: () => []
            },
            separator: {
                type: String
            }
        },

        ready () {
            if (this.separator) {
                this.$el.style.setProperty('--separator', `"${this.separator}"`)
            }
        },

        methods: {
            isLast (index) {
                return index === this.list.length - 1
            }
        }
    }
</script>

<style lang="scss">
    .breadcrumb {
    // > \003e
    // / \2044
    --separator: "\2044";

        list-style: none;
        align-items: center;
        display: flex;
        justify-content: flex-end;

    & > li + li:before {
            padding: 0 5px;
            color: #ccc;
            content: var(--separator, "\2044");
        }
    }
</style>