<template>
    <button
        id="button-compo"
        :disabled="disabled"
        :width="width"
        type="button"
        style="outline: none !important"
        class="inline-flex items-center transition focus:outline-none"
        :class="classAtt"
    >
        <icon-component
            :data-svg="type"
            class="icon-comp"
            v-if="icon"
            :name="icon"
            :type="positionIcon"
            :color="iconCol"
        />
        <div
            v-if="type === 'count'"
            :class="disabled ? 'bg-primary-100' : 'bg-primary-500'"
            class="h-20 w-20 mr-8p rounded-full flex items-center justify-center"
        >
            <span class="text-white text-14">{{ count }}</span>
        </div>
        <!-- <div :class="icon && !isEmptySlot ? 'mx-4p' : ''" class="flex items-center"> -->
        <div
            :class="{
                'mx-4p': icon && !isEmptySlot,
                'opacity-80': disabled,
            }"
            class="flex items-center"
        >
            <slot></slot>
        </div>
    </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import IconComponent from './IconComponent.vue';
export default defineComponent({
    components: {
        IconComponent,
        // IconComponent: () => import('./IconComponent.vue')
    },
    props: {
        size: {
            type: String,
            default: 'small',
        },
        type: {
            type: String,
            default: 'primary',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        icon: {
            type: String,
        },
        positionIcon: {
            type: String,
            default: null,
        },
        width: {
            type: String,
            default: '',
        },
        disclosure: {
            type: Boolean,
            default: false,
        },
        count: {
            type: String,
            default: '0',
        },
        active: {
            type: Boolean,
            default: false,
        },
        colorIcon: {
            type: String,
            default: '',
        },
        isFocus: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { slots }) {
        const isEmptySlot = computed(() => !slots.default);

        const iconCol = computed(() => {
            if (props.type === 'destructive-sublte') return 'error-3';
            else if (props.colorIcon) return props.colorIcon;
            else
                return ['subtle', 'outline', 'secondary', 'link', 'destructive-link'].includes(props.type)
                    ? 'black'
                    : 'white';
        });

        const classAtt = computed(() => {
            const cursorIcon = {
                'cursor-not-allowed': props.disabled,
            };

            const classSize = {
                'text-16': ['link', 'destructive-link'].includes(props.type) && props.size === 'large',
                'py-10p px-20p font-medium h-40':
                    props.size === 'large' && !['link', 'destructive-link'].includes(props.type) && !isEmptySlot.value,
                'py-8p px-16p font-medium h-36':
                    props.size === 'medium' && !['link', 'destructive-link'].includes(props.type) && !isEmptySlot.value,
                'py-6p px-12p font-medium h-32':
                    props.size === 'small' && !['link', 'destructive-link'].includes(props.type) && !isEmptySlot.value,
                'py-0p px-4p font-normal': ['link', 'destructive-link'].includes(props.type),
                'flex justify-center': isEmptySlot.value,
                'w-32 h-32': isEmptySlot.value && props.size === 'small',
                'w-36 h-36': isEmptySlot.value && props.size === 'medium',
                'w-40 h-40': isEmptySlot.value && props.size === 'large',
                'w-16 h-20': isEmptySlot.value && props.size === 'tiny',
            };

            const classIcon = {
                'flex-row-reverse': props.positionIcon === 'right',
                'pr-6p': props.icon && props.positionIcon === 'right',
                'pl-6p': props.icon && props.positionIcon === 'left',
            };

            const classTypeDefault = {
                'bg-primary-500 border-primary-500 hover:bg-primary-700 active:shadow-inner-primary active:bg-primary-500 active:bg-primary-700':
                    props.type === 'primary' && !props.disabled,
                'bg-primary-100': props.type === 'primary' && props.disabled,
                'bg-error-3 border hover:bg-error-2 active:bg-error-2 active:shadow-inner-destructive active:bg-error-3':
                    props.type === 'destructive' && !props.disabled,
                'bg-error-6': props.type === 'destructive' && props.disabled,
                'text-error-3 border hover:bg-error-5 active:bg-white active:shadow-inner-destructive active:bg-white ':
                    props.type === 'destructive-sublte' && !props.disabled,
                '': props.type === 'destructive-sublte' && props.disabled,
                'bg-neutrals-100 border hover:bg-neutrals-200 active:bg-neutrals-200 active:border-neutrals-200 active:outline-none active:border-primary-500 active:bg-neutrals-50 ':
                    props.type === 'secondary' && !props.disabled,
                'bg-neutrals-50 text-neutrals-300': props.type === 'secondary' && props.disabled,
                'bg-transparent border border-neutrals-100 hover:bg-neutrals-100 active:bg-neutrals-50 active:border-neutrals-100 active:outline-none active:border-primary-500 active:bg-white outline-none':
                    props.type === 'outline' && !props.disabled,
                'bg-white border border-neutrals-100 text-neutrals-300': props.type === 'outline' && props.disabled,
                'hover:bg-neutrals-50  hover:border-neutrals-50 border active:bg-neutrals-200 active:border-neutrals-100  active:border-primary-500 outline-none':
                    props.type === 'subtle' && !props.disabled,
                'text-neutrals-300': props.type === 'subtle' && props.disabled,
                'text-primary-500 border active:bg-neutrals-50 active:text-primary-700 active:underline hover:underline active:outline-none active:border-primary-500 hover:text-primary-700':
                    props.type === 'link' && !props.disabled,
                'text-primary-100 border': props.type === 'link' && props.disabled,
                'text-error-3 border active:bg-neutrals-50 hover:underline hover:text-error-2 active:outline-none active:border-primary-500 active:text-error-2 active:underline':
                    props.type === 'destructive-link' && !props.disabled,
                'text-error-6 border': props.type === 'destructive-link' && props.disabled,
                'bg-primary-50 hover:bg-primary-100 active:bg-primary-200 active:bg-primary-50 border active:outline-none active:border-primary-500 text-primary-700':
                    props.type === 'count' && !props.disabled,
                'bg-primary-50 text-primary-100': props.type === 'count' && props.disabled,
                'shadow-sm': !['secondary', 'subtle', 'outline', 'link', 'destructive-link', 'destructive-sublte'].includes(props.type),
            };

            const classTypeFocus = {
                'bg-primary-500 border-primary-500 hover:bg-primary-700 focus:shadow-inner-primary focus:bg-primary-500 active:bg-primary-700':
                    props.type === 'primary' && !props.disabled,
                'bg-primary-100': props.type === 'primary' && props.disabled,
                'bg-error-3 border hover:bg-error-2 active:bg-error-2 focus:shadow-inner-destructive focus:bg-error-3':
                    props.type === 'destructive' && !props.disabled,
                'bg-error-6': props.type === 'destructive' && props.disabled,
                'border hover:bg-error-5 active:bg-white focus:shadow-inner-destructive focus:bg-white ':
                    props.type === 'destructive-sublte' && !props.disabled,
                '': props.type === 'destructive-sublte' && props.disabled,
                'bg-neutrals-100 border hover:bg-neutrals-200 active:bg-neutrals-200 active:border-neutrals-200 focus:outline-none focus:border-primary-500 focus:bg-neutrals-50 ':
                    props.type === 'secondary' && !props.disabled,
                'bg-neutrals-50 text-neutrals-300': props.type === 'secondary' && props.disabled,
                'bg-transparent border border-neutrals-100 hover:bg-neutrals-100 active:bg-neutrals-50 active:border-neutrals-100 focus:outline-none focus:border-primary-500 focus:bg-white outline-none':
                    props.type === 'outline' && !props.disabled,
                'bg-white border border-neutrals-100 text-neutrals-300': props.type === 'outline' && props.disabled,
                'hover:bg-neutrals-50  hover:border-neutrals-50 border active:bg-neutrals-200 active:border-neutrals-100  focus:border-primary-500 outline-none':
                    props.type === 'subtle' && !props.disabled,
                'text-neutrals-300': props.type === 'subtle' && props.disabled,
                'text-primary-500 border active:bg-neutrals-50 active:text-primary-700 active:underline hover:underline focus:outline-none focus:border-primary-500 hover:text-primary-700':
                    props.type === 'link' && !props.disabled,
                'text-primary-100 border': props.type === 'link' && props.disabled,
                'text-error-3 border active:bg-neutrals-50 hover:underline hover:text-error-2 focus:outline-none focus:border-primary-500 active:text-error-2 active:underline':
                    props.type === 'destructive-link' && !props.disabled,
                'text-error-6 border': props.type === 'destructive-link' && props.disabled,
                'bg-primary-50 hover:bg-primary-100 active:bg-primary-200 focus:bg-primary-50 border focus:outline-none focus:border-primary-500 text-primary-700':
                    props.type === 'count' && !props.disabled,
                'bg-primary-50 text-primary-100': props.type === 'count' && props.disabled,
                'shadow-sm': !['secondary', 'subtle', 'outline', 'link', 'destructive-link'].includes(props.type),
            };

            const classType = props.isFocus ? classTypeFocus : classTypeDefault;

            const classTextCol = {
                'text-error-3': ['destructive-subtle'].includes(props.type),
                'text-white': ['primary', 'destructive'].includes(props.type),
                'text-neutrals-900': ['secondary', 'outline', 'subtle'].includes(props.type) && !props.disabled,
            };

            const active = {
                'active-btn': props.active,
            };

            return {
                ...active,
                ...classSize,
                ...classType,
                ...classTextCol,
                ...classIcon,
                ...cursorIcon,
                'inline-flex items-center border-transparent text-14 rounded-4p  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500':
                    true,
            };
        });
        return { classAtt, isEmptySlot, iconCol };
    },
});
</script>

<style lang="scss" scoped>
button.active-btn {
    border-color: #3e6dda;
    border-color: rgba(62, 109, 218, var(--border-opacity));
}
button {
    transition: 0.5s all;
    // > div {
    //     transition: 0.5s all;
    // }
    .icon-comp[data-svg='primary'] {
        :deep(svg) {
            fill: white;
        }
    }
    .icon-comp[data-svg='secondary'] {
        :deep(svg) {
            fill: black;
        }
    }
    .icon-comp[data-svg='outline'] {
        :deep(svg) {
            fill: currentColor;
        }
    }
    .icon-comp[data-svg='subtle'] {
        :deep(svg) {
            fill: black;
        }
    }
    .icon-comp[data-svg='link'] {
        :deep(svg) {
            fill: #3e6dda;
        }
    }
    .icon-comp[data-svg='destructive'] {
        :deep(svg) {
            fill: white;
        }
    }
    .icon-comp[data-svg='destructive-link'] {
        :deep(svg) {
            fill: #ec2b08;
        }
    }
    &:hover {
        .icon-comp[data-svg='link'] {
            :deep(svg) {
                fill: #1b3d8d;
            }
        }
        .icon-comp[data-svg='destructive-link'] {
            :deep(svg) {
                fill: #b12006;
            }
        }
    }
    &:focus {
        .icon-comp[data-svg='link'] {
            :deep(svg) {
                fill: #3e6dda;
            }
        }
        .icon-comp[data-svg='destructive-link'] {
            :deep(svg) {
                fill: #ec2b08;
            }
        }
    }
    &:active {
        .icon-comp[data-svg='link'] {
            :deep(svg) {
                fill: #1b3d8d;
            }
        }
        .icon-comp[data-svg='destructive-link'] {
            :deep(svg) {
                fill: #b12006;
            }
        }
    }
    &[disabled],
    &:disabled {
        .icon-comp[data-svg='subtle'],
        .icon-comp[data-svg='outline'],
        .icon-comp[data-svg='secondary'] {
            color: white;
            :deep(svg) {
                fill: #9b9ba8;
            }
        }
        .icon-comp[data-svg='link'] {
            :deep(svg) {
                fill: #bfcef3;
            }
        }
        .icon-comp[data-svg='destructive-link'] {
            :deep(svg) {
                fill: #f29f8f;
            }
        }
    }
}
</style>
