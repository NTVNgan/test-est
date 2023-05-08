<template>
    <div>
        <template v-if="type == 'avatar'">
            <div
                class="list-item-component list-item-component__avatar text-14 py-8p px-12p rounded cursor-pointer flex items-center justify-between"
                :class="[activeColor, { active: active, disable: disabled, 'font-medium': active }]"
            >
                <div class="flex items-center">
                    <div :class="$slots.decription ? 'mr-16p' : 'mr-8p'" v-if="$slots.avatar">
                        <slot name="avatar"></slot>
                    </div>
                    <div class="content">
                        <slot></slot>
                        <div
                            class="decription text-12 mt-2p"
                            :class="[active ? 'font-normal text-primary-300' : 'text-neutrals-300']"
                            v-if="$slots.decription"
                        >
                            <slot name="decription"></slot>
                        </div>
                    </div>
                </div>
                <icon-component v-if="active" name="check" color="primary-500"></icon-component>
            </div>
        </template>
        <template v-else-if="type == 'checkbox'">
            <div
                class="list-item-component list-item-component__checkbox text-14 py-10p px-12p rounded"
                :class="[activeColor, { disable: disabled }]"
            >
                <slot></slot>
            </div>
        </template>
        <template v-else-if="type == 'radio'">
            <div
                class="list-item-component list-item-component__radio text-14 p-8p rounded"
                :class="[activeColor, { disable: disabled }]"
            >
                <slot></slot>
            </div>
        </template>
        <template v-else>
            <div
                class="list-item-component text-14 py-8p px-12p rounded cursor-pointer flex items-center"
                :class="[
                    'list-item-component__' + nameListItem,
                    activeColor,
                    {
                        active: active || activeSingle,
                        disable: disabled & !active,
                        'font-medium': $slots.decription && (active || activeSingle),
                    },
                ]"
            >
                <icon-component
                    v-if="nameIcon"
                    :name="nameIcon"
                    showClassText
                    :color="disabled ? 'text-neutrals-300' : 'text-neutrals-500'"
                    class="mr-8p"
                />
                <div class="list-item-component__item flex items-center justify-between w-full">
                    <div class="content" :class="truncateContent ? 'truncate' : ''">
                        <slot></slot>
                        <div v-if="$slots.suffix" class="inline-block ml-8p">
                            <slot name="suffix"></slot>
                        </div>
                        <div
                            class="decription text-12 mt-2p"
                            :class="[active || activeSingle ? 'font-normal text-primary-300' : 'text-neutrals-300']"
                            v-if="$slots.decription"
                        >
                            <slot name="decription"></slot>
                        </div>
                    </div>
                    <icon-component
                        v-if="(active || activeSingle) && typeActive === 'selected'"
                        name="check"
                        color="primary-500"
                    ></icon-component>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';

export default defineComponent({
    name: 'ListItem',
    components: {
        IconComponent,
    },
    props: {
        type: {
            type: String,
            default: 'default',
        },
        active: {
            type: Boolean,
            default: false,
        },
        activeSingle: {
            type: Boolean,
            default: false,
        },
        typeActive: {
            type: String,
            default: 'active',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        nameIcon: {
            type: String,
            default: '',
        },
        value: {
            type: null,
        },
        truncateContent: {
            type: Boolean,
            default: true,
        },
    },
    setup(props) {
        const nameListItem = computed(() => {
            switch (props.type) {
                case 'default-blue':
                    return 'default-blue';
                default:
                    return 'default';
            }
        });

        const activeColor = computed(() => {
            switch (props.type) {
                case 'avatar':
                    if (props.active) return 'text-primary-500 hover:bg-neutrals-50';
                    else if (props.disabled) return 'text-neutrals-300 cursor-not-allowed';
                    else return 'text-neutrals-900 hover:bg-neutrals-50';
                case 'checkbox':
                case 'radio':
                    if (props.active) return 'text-neutrals-900 hover:bg-neutrals-50';
                    else if (props.disabled) return 'text-neutrals-300 cursor-not-allowed';
                    else return 'text-neutrals-900 hover:bg-neutrals-50';
                case 'default-blue':
                    if (props.active) return 'text-primary-500 bg-primary-50';
                    else if (props.disabled) return 'text-neutrals-300 cursor-not-allowed';
                    else return 'text-neutrals-900 hover:bg-neutrals-50';
                default:
                    if ((props.active || props.activeSingle) && props.typeActive === 'active')
                        return 'text-neutrals-900 bg-primary-50';
                    if ((props.active || props.activeSingle) && props.typeActive === 'selected')
                        return 'text-primary-500 font-medium hover:bg-neutrals-50';
                    else if (props.disabled) return 'text-neutrals-300 cursor-not-allowed';
                    else return 'text-neutrals-900 hover:bg-neutrals-50';
            }
        });

        return {
            nameListItem,
            activeColor,
        };
    },
});
</script>
