<template>
    <div class="main">
        <slot v-if="!loading"></slot>
        <transition name="component-fade">
            <div v-if="loading" class="loading" :class="{'inside': inside}">
                <div class="message">{{loadingText}}</div>
            </div>
        </transition>
    </div>
</template>

<script type="text/babel">
export default {
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        loadingText: {
            type: String,
            default: 'Loading...'
        },
        inside: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style type="text/css" lang="less" rel="stylesheet/less">
    .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity .3s ease;
    }
    .component-fade-enter, .component-fade-leave-active {
        opacity: 0;
    }
    .loading {
        position: absolute;
        z-index: 1001;
        top: 0;
        left: 0;
        background-color: rgba(230, 233, 236, 0.8);
        cursor: wait;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &.inside {
            height: 100vh;
            z-index: -1;
        }

        .message {
            background-color: #f4f4f4;
            border-radius: 4px;
            box-shadow: 0 1px 8px rgba(0,0,0,.15);
            border: solid 1px #bbb;
            padding: 10px 20px;
        }
    }
</style>