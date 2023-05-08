<template>
    <div class="progress-bar-component w-full flex items-center">
        <div class="progress-bar rounded bg-primary-50 w-full">
            <div
                class="progress-bar__value rounded bg-primary-500"
                :class="sizeProgress"
                :style="{ width: value + '%' }"
            ></div>
        </div>
        <span class="percent ml-12p text-14 text-neutrals-500" v-if="percentage">{{ value + '%' }}</span>
    </div>
</template>

<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
    name: 'ProressBar',
    props: {
        size: {
            type: String,
            default: 'small',
        },
        value: {
            type: Number,
            default: 50,
        },
        percentage: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const sizeProgress = computed(() => {
            switch (props.size) {
                case 'small':
                    return 'h-8';
                case 'medium':
                    return 'h-16';
                case 'large':
                    return 'h-32';
            }
            return '';
        });

        return { sizeProgress };
    },
});
</script>
