<template>
    <img v-if="isLoadSucess" :src="src" :alt="alt" :class="classAtt" @error="onLoadErrorImage" />
    <div v-else class="border border-transparent  border-neutrals-100" :class="classErr">
        <icon-component class="icon-comp" name="image" />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import IconComponent from './IconComponent.vue';

export default defineComponent({
    name: 'ThumbnailComponent',
    components: {
        IconComponent,
    },
    props: {
        size: {
            type: String,
            default: 'medium',
        },
        alt: {
            type: String,
            default: '',
        },
        src: {
            type: String,
            deafult: '',
        },
        border: {
            type: Boolean,
            default: true,
        },
        radius: {
            type: String,
            default: '',
        },
    },
    setup(props) {
        const classAtt = computed(() => {
            const size = {
                'w-40 h-40': props.size === 'small',
                'w-60 h-60': props.size === 'medium' || !['small', 'medium', 'large'].includes(props.size),
                'w-80 h-80': props.size === 'large',
            };

            const border = {
                'border border-transparent border-neutrals-100': props.border,
            };

            const radius = {
                'rounded-2p': props.radius.toString() === '2',
                'rounded-4p': props.radius.toString() === '4',
            };

            return {
                ...size,
                ...border,
                ...radius,
            };
        });

        const classErr = computed(() => {
            const size = {
                'w-40 h-40': props.size === 'small',
                'w-60 h-60': props.size === 'medium' || !['small', 'medium', 'large'].includes(props.size),
                'w-80 h-80': props.size === 'large',
            };
            const radius = {
                'rounded-2p': props.radius.toString() === '2',
                'rounded-4p': props.radius.toString() === '4',
            };

            return {
                ...size,
                ...radius,
            };
        });

        const isLoadSucess = ref(true);

        const onLoadErrorImage = () => {
            isLoadSucess.value = false;
        };

        return {
            classAtt,
            classErr,
            onLoadErrorImage,
            isLoadSucess,
        };
    },
});
</script>

<style lang="scss" scoped>
.icon-comp {
    :deep(svg) {
        margin: 0 auto;
        height: -webkit-fill-available;
    }
}
</style>
