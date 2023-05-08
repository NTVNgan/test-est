<template>
    <div class="ds-card grid">
        <div>
            <h4 class="mb-4p text-left">Default</h4>
            <Card />
        </div>
        <div>
            <h4 class="mb-4p text-left">Shadow</h4>
            <Card :type="'shadow'" />
        </div>
        <div>
            <h4 class="mb-4p text-left">Large</h4>
            <Card :type="'large'" />
        </div>
        <div>
            <h4 class="mb-4p text-left">Dashed line</h4>
            <Card :type="'dashed-line'" />
        </div>
        <div>
            <h4 class="mb-4p text-left">Modal</h4>
            <Card :type="'modal'" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Card from '@/components/ui/CardComponent.vue';

export default defineComponent({
    components: { Card },
});
</script>

<style lang="scss" scoped>
.ds-card {
    grid-gap: 16px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 20px;
}
</style>
