<template>
    <div class="h-56 flex justify-between items-center bg-white px-24p border-b border-neutrals-100">
        <img src="@/assets/images/logo.svg" alt="logo" />
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    components: {},
    setup() {
        return {};
    },
});
</script>
