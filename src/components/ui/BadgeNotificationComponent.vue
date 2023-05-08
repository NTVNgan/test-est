<template>
    <div class="badge-notification-component">
        <span class="text-12 font-medium text-center" :class="[bgBadge, widthBage]">
            <slot v-if="count <= 99">
                {{ count }}
            </slot>
            <slot v-else>99<span class="plus">+</span></slot>
        </span>
    </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'Badge Notification Component',
    props: {
        count: {
            type: Number,
            default: 1,
        },
        type: {
            type: String,
            default: 'primary',
        },
    },
    setup(props) {
        const bgBadge = computed(() => {
            return props.type === 'primary'
                ? 'bg-error-3 text-white border border-neutrals-50'
                : 'bg-neutrals-100 text-neutrals-900 shadow-inner-badge';
        });

        const widthBage = computed(() => {
            if (1 <= props.count && props.count <= 9) {
                return 'w-16 h-16 rounded-50% flex items-center justify-center';
            } else if (10 <= props.count && props.count <= 99) {
                return 'w-26 h-16 rounded-10p px-6p flex items-center justify-center';
            } else if (props.count > 99) {
                return 'w-34 h-16 rounded-10p px-6p flex items-center justify-center';
            }
            return '';
        });

        return {
            bgBadge,
            widthBage,
        };
    },
});
</script>

<style lang="scss">
.badge-notification-component {
    .under9 {
        padding: 0 4.5px;
    }
    .plus {
        margin-left: 1px;
    }
}
</style>
