<template>
    <button class="dropdown-component relative inline-block text-left focus:outline-none">
        <div :class="{ disabled: disabled }">
            <slot name="header"></slot>
        </div>
        <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
            v-if="!disabled"
            class="absolute content-dropdown z-20"
        >
            <slot name="list"></slot>
        </div>
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
    },
});
</script>
<style lang="scss" scroped>
.content-dropdown {
    z-index: 9;
}
</style>
