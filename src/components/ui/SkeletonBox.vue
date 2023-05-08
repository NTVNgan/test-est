<template>
    <div :style="{ height, width: computedWidth, maxWidth }" class="skeleton-box" :class="[type, classBgColor]" />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
export default defineComponent({
    name: `SkeletonBox`,
    props: {
        maxWidthPercent: {
            default: 100,
            type: Number,
        },
        minWidthPercent: {
            default: 80,
            type: Number,
        },
        height: {
            default: `8px`,
            type: String,
        },
        width: {
            default: null,
            type: String,
        },
        type: {
            default: null,
            type: String,
        },
        maxWidth: {
            default: null,
            type: String,
        },
        classBgColor: {
            type: String,
            default: 'bg-neutrals-100',
        }
    },
    setup(props) {
        const computedWidth = computed(() => {
            // return props.width || `${Math.floor(Math.random() * (props.maxWidthPercent - props.minWidthPercent) + props.minWidthPercent)}%`;
            return props.width;
        });

        return {
            computedWidth,
        }
    },
});
</script>

<style lang="scss">
.skeleton-box {
    display: block;
    vertical-align: middle;
    overflow: hidden;
    // background-color: #DDDBDD;
    // &::after {
    //     position: absolute;
    //     top: 0;
    //     right: 0;
    //     bottom: 0;
    //     left: 0;
    //     transform: translateX(-100%);
    //     background-image: linear-gradient(
    //         90deg,
    //         rgba(#ffffff, 0) 0,
    //         rgba(#ffffff, 0.2) 20%,
    //         rgba(#ffffff, 0.5) 60%,
    //         rgba(#ffffff, 0)
    //     );
    //     animation: shimmer 5s infinite;
    //     content: '';
    // }
    &.circle{
        border-radius: 50%;
    }
    &.button{
        border-radius: 4px;
    }

    @keyframes shimmer {
        100% {
            transform: translateX(100%);
        }
    }
}
</style>
