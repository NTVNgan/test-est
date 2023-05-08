<template>
    <div class="badge-chip-component">
        <span
            class="flex items-center justify-center text-12 font-medium font-body block text-center rounded-20p px-6p py-2p w-max"
            :class="type === 'pip' ? 'text-neutrals-900' : textColor"
            :style="{ boxShadow: borderColor, backgroundColor: background }"
        >
            <span class="badge-dot w-8 h-8 rounded-50% mr-4p" :class="dotColor" v-if="type === 'pip'"></span>
            {{ content }}
        </span>
    </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'Badge Chip Component',
    props: {
        type: {
            type: String,
            default: 'basic',
        },
        status: {
            type: String,
            default: 'neutral',
        },
        background: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            default: 'neutral',
        },
    },
    setup(props) {
        const borderColor = computed(() => {
            switch (props.status) {
                case 'neutral':
                    return '0px 0px 0px 1px #E9E9EC inset';
                case 'info':
                    return '0px 0px 0px 1px #5E85E0 inset';
                case 'success':
                    return '0px 0px 0px 1px #98DAB2 inset';
                case 'warning':
                    return '0px 0px 0px 1px #FFD466 inset';
                case 'critical':
                    return '0px 0px 0px 1px #F29F8F inset';
            }
            return '';
        });

        const textColor = computed(() => {
            switch (props.status) {
                case 'neutral':
                    return 'text-neutrals-900';
                case 'info':
                    return 'text-primary-800';
                case 'success':
                    return 'text-success-2';
                case 'warning':
                    return 'text-warning-2';
                case 'critical':
                    return 'text-error-2';
            }
            return '';
        });

        const dotColor = computed(() => {
            switch (props.status) {
                case 'neutral':
                    return 'bg-neutrals-300';
                case 'info':
                    return 'bg-primary-500';
                case 'success':
                    return 'bg-success-3';
                case 'warning':
                    return 'bg-warning-3';
                case 'critical':
                    return 'bg-error-3';
            }
            return '';
        });

        return {
            borderColor,
            textColor,
            dotColor,
        };
    },
});
</script>
