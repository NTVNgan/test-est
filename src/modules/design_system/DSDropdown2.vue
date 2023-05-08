<template>
    <div>
        <new-dropdown-component id="inbox" width="192px" v-model="show">
            <template #header> dropdown </template>
            <template #content> gâu gâu </template>
        </new-dropdown-component>
        <new-dropdown-component2 class="inline-block" label="Tooltip" position="top-right">
            <template #content>
                This is a large and dark tooltip. This is a large and dark tooltip. This is a large and dark tooltip.
                This is a large and dark tooltip.
            </template>
            <span>Dropdown</span>
        </new-dropdown-component2>
        <br>
    </div>
</template>

<script>
import { ref } from 'vue';
import NewDropdownComponent from '@/components/ui/NewDropdownComponent.vue';
import NewDropdownComponent2 from '@/components/ui/NewDropdownComponent.vue';

export default {
    name: 'DSDropdown2',
    components: {
        NewDropdownComponent,
        NewDropdownComponent2,
    },
    setup() {
        const show = ref(false);
        const showDropdown = ref(false);
        return {
            show,
            showDropdown,
        };
    },
};
</script>

<style>
</style>