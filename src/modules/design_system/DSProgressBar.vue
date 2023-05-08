<template>
    <div class="ds-progress-bar p-12p">
        <div class="grid grid-flow-col grid-cols-2 mb-16p">
            <div class="border-r-2 pr-16p mr-16p">
                <label class="block text-16 font-bold text-gray-700 mb-4p text-center">No percentage</label>
                <label>Small</label>
                <progress-bar class="mb-16p" />
                <label>Medium</label>
                <progress-bar size="medium" class="mb-16p" />
                <label>Large</label>
                <progress-bar size="large" />
            </div>
            <div>
                <label class="block text-16 font-bold text-gray-700 mb-4p text-center">With percentage</label>
                <label>Small</label>
                <progress-bar class="mb-16p" percentage />
                <label>Medium</label>
                <progress-bar size="medium" class="mb-16p" percentage />
                <label>Large</label>
                <progress-bar size="large" percentage />
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import ProgressBar from '@/components/ui/ProgressBarComponent.vue';

export default defineComponent({
    name: 'Progress Bar Component',
    components: {
        ProgressBar,
    },
});
</script>
