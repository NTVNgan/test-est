<template>
    <div class="card bg-white rounded border" :class="styleCard">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CardComponent',
    props: {
        type: {
            type: String,
            default: 'default',
        },
    },
    computed: {
        styleCard(): string {
            return this.classCard(this.type);
        },
    },
    methods: {
        classCard(val: string) {
            switch (val) {
                case 'shadow':
                    return 'shadow-deep-1 border-none hover:shadow-2p';
                case 'large':
                    return 'large shadow-2p border-primary-transparent hover:border-primary-500';
                case 'dashed-line':
                    return 'dashed-line border-dashed border-neutrals-200 hover:border-primary-500';
                case 'modal':
                    return 'modal shadow-3p';
                default:
                    return 'default border border-neutrals-200 hover:border-primary-500';
            }
        },
    },
});
</script>

<style lang="scss" scoped>
.card {
    // min-height: 120px;
    &.shadow:active {
        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1), 0px 2px 20px rgba(0, 0, 0, 0.1);
    }
    &.default:active {
        border-color: #3e6dda;
    }
    &.large:active {
        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1), 0px 2px 20px rgba(0, 0, 0, 0.1);
        border-color: #3e6dda;
    }
    &.dashed-line:active {
        border-color: #3e6dda;
    }
}
</style>
