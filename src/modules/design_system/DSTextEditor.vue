<template>
    <div>
        <text-editor-component v-model="text" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TextEditorComponent from '@/components/ui/TextEditorComponent/TextEditorComponent.vue';
export default defineComponent({
    name: 'DSTextEditor',
    components: {
        TextEditorComponent,
    },
    setup() {
        const text = ref('');
        return {
            text,
        };
    },
});
</script>

<style lang="scss" scoped></style>
