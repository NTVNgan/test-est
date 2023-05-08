<template>
    <template v-if="icon">
        <button
            v-if="isShowTag"
            @click="sendValue"
            class="
                tag-component-custom
                flex
                outline-none
                items-center
                focus:outline-none
                tag-icon
                py-2p
                px-8p
                min-h-24
                border
                rounded
                border-neutrals-100
                max-w-196
            "
            :class="[{ error, 'bg-neutrals-100': disabled, 'pr-0': isClose }, classCustom]"
        >
            <icon-component :name="icon" showClassText color="text-neutrals-200" />
            <span class="text-12 py-2p px-4p" :class="{ truncate }"><slot></slot></span>
            <span class="icon-close" v-if="isClose" @click="onClickCloseIcon">
                <icon-component :name="'TimesSolid12'" color="#141417" />
            </span>
        </button>
    </template>
    <template v-else>
        <button
            v-if="isShowTag"
            @click="sendValue"
            class="tag-component-custom flex items-center focus:outline-none truncate"
            :class="[isClose ? 'show-icon' : 'hide-icon', disabled ? 'disabled' : 'group', { error }]"
        >
            <span
                class="text-12 px-8p"
                :class="[
                    isClose
                        ? 'rounded-l-4p'
                        : error
                        ? 'group-focus:shadow-inner-tag-error rounded'
                        : 'group-focus:shadow-inner-tag rounded',
                    error ? 'text-error-3 bg-error-7' : 'text-neutrals-900 bg-neutrals-100',
                ]"
            >
                <slot></slot
            ></span>
            <span
                v-if="isClose"
                class="icon-close bg-neutrals-100 rounded-r-4p flex items-center justify-center"
                @click="onClickCloseIcon"
            >
                <icon-component :name="'TimesSolid12'" color="#141417" />
            </span>
        </button>
    </template>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import IconComponent from './IconComponent.vue';

export default defineComponent({
    name: 'Tag Component',
    components: { IconComponent },
    props: {
        isClose: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        value: {
            default: null,
        },
        error: {
            type: Boolean,
            default: false,
        },
        icon: {
            type: String,
            default: '',
        },
        classCustom: {
            type: String,
            default: '',
        },
        truncate: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['clickTag', 'close'],
    setup(props, { emit }) {
        const isShowTag = ref(true);

        const sendValue = () => {
            emit('clickTag', props.value);
        };

        const onClickCloseIcon = () => {
            console.log('close');
            if (!props.disabled) emit('close', props.value);
        };

        return { isShowTag, sendValue, onClickCloseIcon };
    },
});
</script>

<style lang="scss">
.tag-component-custom {
    .icon-close {
        border-left: 1px solid #fff;
        width: 20px;
        height: 20px;
    }
    &:hover:not(.tag-icon) {
        .icon-close {
            background: #b4b4be;
        }
    }
    &.show-icon {
        &:focus {
            .icon-close {
                border: 1px solid #3e6dda;
            }
        }
    }
    &.hide-icon {
        &:focus {
            span {
                border-color: #3e6dda;
            }
        }
    }
    &.disabled {
        // pointer-events: none;
        &.show-icon {
            path {
                fill: #9b9ba8;
            }
            &:focus {
                .icon-close {
                    border: none;
                    border-left: 1px solid #fff;
                }
            }
            &:hover {
                .icon-close {
                    background-color: #e9e9ec;
                }
            }
            .icon-close {
                pointer-events: none;
            }
        }
        span {
            color: #9b9ba8;
        }
        &:focus {
            span {
                border-color: transparent;
            }
        }
        &.error {
            span {
                color: #f29f8f;
            }
        }
    }
    &.tag-icon {
        &:hover {
            border-color: #b4b4be;
        }
        &:focus {
            border-color: #3e6dda;
        }
        &.disabled {
            border-color: #b4b4be;
        }
        .icon-close {
            border-left: none;
        }
    }
}
</style>
