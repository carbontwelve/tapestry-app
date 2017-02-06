<template>
    <ol class="breadcrumb">
        <li v-for="item, index in list">
            <span class="active" v-if="isLast(index)">{{item.label}}</span>
            <router-link :to="item.route" active-class="is-active-crumb" v-else>
                {{item.label}}
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
                console.log(index + ' ' + (this.list.length - 1) + ' ' + ((index === this.list.length - 1) ? 'true' : 'false'))
                return index === this.list.length - 1
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/less">
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