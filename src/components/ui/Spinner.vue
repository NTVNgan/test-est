<template>
    <div class="spinner" :class="`spinner--${size}`" v-bind:style="{ '--spinerColor': color }">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SpinnerComponent',
    props: {
        size: {
            type: String,
            default: 'medium',
        },
        color: {
            type: String,
            default: '#3e6dda',
        },
    },
});
</script>

<style lang="scss">
.spinner {
    display: inline-block;
    position: relative;
    div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        border-radius: 50%;
        border-style: solid;
        animation: spiner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: var(--spinerColor) transparent transparent transparent;
        &:nth-child(1) {
            animation-delay: -0.45s;
        }
        &:nth-child(2) {
            animation-delay: -0.3s;
        }
        &:nth-child(3) {
            animation-delay: -0.15s;
        }
    }
    &--medium {
        width: 40px;
        height: 40px;
        div {
            width: 32px;
            height: 32px;
            margin: 8px;
            border-width: 4px;
        }
    }
    &--normal {
        width: 24px;
        height: 24px;
        div {
            width: 16px;
            height: 16px;
            margin: 2px;
            border-width: 2px;
        }
    }
    &--small {
        width: 18px;
        height: 18px;
        div {
            width: 16px;
            height: 16px;
            margin: 2px;
            border-width: 2px;
        }
    }
}
</style>
