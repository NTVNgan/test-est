<template>
    <div class="p-16p">
        <div class="text-center">
            <label class="pr-16p">Default:</label>
            <ColorPicker v-model="valueColor" />
        </div>
        <div class="mt-16p text-center">
            <label class="pr-16p">Disabled:</label>
            <ColorPicker v-model="valueColor" disabled />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import ColorPicker from '@/components/ui/ColorPickerComponent.vue';

export default defineComponent({
    name: 'Color Picker',
    components: { ColorPicker },
    data() {
        return {
            valueColor: '#cf3e3e',
        };
    },
});
</script>

<style lang="scss" scoped>
.color-picker-component {
    display: inline-block;
}
</style>
