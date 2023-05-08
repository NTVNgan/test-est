<template>
    <div
        class="editable flex flex-wrap items-start hover:text-primary-500"
        :style="{ width: width }"
        v-click-outside="submitClickOutside"
    >
        <div
            v-if="!isEdit"
            class="editable__composer flex items-center mr-4p py-8p"
            :class="[{ disabled: disabled }, { locked: locked }]"
        >
            <Icon v-if="icon" :name="icon" color="neutrals-400"></Icon>
            <template v-if="valueSync">
                <Tooltip v-if="showTooltip" class="w-auto min-w-0" size="small" type="light" position="top">
                    <template #content>
                        <div class="flex items-center">
                            <span>{{ valueSync }}</span>
                            <Tooltip
                                class="inline-block ml-8p"
                                type="dark"
                                position="top"
                                content="Copied"
                                label="Tooltip"
                                showByClick
                            >
                                <Icon
                                    name="copy"
                                    class="cursor-pointer icon-copy"
                                    @click="helper.copyToClipboard(valueSync)"
                                />
                            </Tooltip>
                        </div>
                    </template>
                    <span
                        @click.stop.prevent="showEditable"
                        class="inline-block max-w-full cursor-pointer truncate border-b border-dashed border-neutrals-200 text-14"
                        :class="[{ 'ml-8p': icon }, classLabel]"
                    >
                        {{ valueSync }}
                    </span>
                </Tooltip>
                <span v-else class="tooltip__title w-auto min-w-0">
                    <span
                        class="inline-block max-w-full cursor-pointer truncate border-b border-dashed border-neutrals-200 text-14 font-bold text-24"
                    >
                        {{ valueSync }}
                    </span>
                </span>
            </template>
            <span
                v-if="!valueSync"
                @click.stop.prevent="showEditable"
                class="cursor-pointer truncate text-primary-500 text-14 ml-8p hover:underline"
                >{{ emptyLabel }}</span
            >
        </div>
        <div v-if="isEdit" class="editable__composer--is-edit text-14">
            <Input
                :maxlength="maxlength"
                v-model.trim="valueSync"
                :state="error && error !== 'null' ? 'error' : 'primary'"
                :placeholder="placeholder"
                v-on:keydown.enter="submitChangeByEnter"
            >
                <template v-slot:prefix v-if="icon">
                    <Icon :name="icon" color="neutrals-400"></Icon>
                </template>
            </Input>
            <div v-if="error && error !== 'null'" class="break-words text-error-3 mt-4p" :class="classError">
                {{ $t(`${pageError}_${error}`) }}
            </div>
        </div>
        <div class="editable__button" :class="{ 'editable__button--show w-full justify-end my-8p': isEdit }">
            <template v-if="isEdit">
                <template v-if="showTooltip">
                    <Button @click="cancelEditable" size="small" type="outline" class="mr-8p">
                        Cancel
                    </Button>
                    <Button
                        :disabled="error !== '' || error === 'null'"
                        @click="submitChange"
                        size="small"
                        type="secondary"
                    >
                        Save
                    </Button>
                </template>
                <template v-else>
                    <Button
                        :disabled="error !== '' || error === 'null'"
                        @click="submitChange"
                        size="small"
                        type="secondary"
                        class="mr-8p"
                    >
                        Save
                    </Button>
                    <Button @click="cancelEditable" size="small" type="outline">
                        Cancel
                    </Button>
                </template>
            </template>
            <template v-else>
                <Button
                    v-if="!disabled && !locked"
                    @click.stop.prevent="showEditable"
                    size="medium"
                    type="secondary"
                    icon="pen"
                ></Button>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import Icon from '@/components/ui/IconComponent.vue';
import Tooltip from '@/components/ui/TooltipComponent.vue';
import helper from '@/utils/helper';
export default {
    name: 'InboxEditable',
    components: {
        Button,
        Input,
        Icon,
        Tooltip,
    },
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        icon: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: '',
        },
        emptyLabel: {
            type: String,
            default: '',
        },
        classLabel: {
            type: String,
            default: '',
        },
        width: {
            type: String,
            default: '',
        },
        maxlength: {
            type: Number,
            default: undefined,
        },
        error: {
            type: String,
            default: '',
        },
        editKey: {
            type: String,
            default: '',
        },
        activeKey: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        locked: {
            type: Boolean,
            default: false,
        },
        onSubmit: {
            type: Function,
            default: () => true,
        },
        classError: {
            type: String,
            default: '',
        },
        pageError: {
            type: String,
            default: 'inbox.inbox_customer_info_error',
        },
        showTooltip: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['update:modelValue', 'update:activeKey', 'changeValue'],
    setup(props: any, { emit }: any) {
        const valueSync = computed({
            get(): string {
                return props.modelValue;
            },
            set(value: string) {
                emit('update:modelValue', value);
            },
        });
        const activeKeySync = computed({
            get(): string {
                return props.activeKey;
            },
            set(value: string) {
                emit('update:activeKey', value);
            },
        });
        const isEdit = computed(() => props.editKey === activeKeySync.value);
        const oldValue = ref<string>('');
        const preActiveKey = ref<string | null>(null);
        const submitChange = () => {
            if (props.error === '' && oldValue.value !== valueSync.value) {
                props.onSubmit();
            }
            if (props.error === '' && oldValue.value === valueSync.value) {
                activeKeySync.value = '';
            }
        };
        const submitChangeByEnter = () => {
            if (isEdit.value && props.error === '' && oldValue.value !== valueSync.value) {
                props.onSubmit();
            }
            if (isEdit.value && props.error === '' && oldValue.value === valueSync.value) {
                activeKeySync.value = '';
            }
        };
        const submitClickOutside = () => {
            if (activeKeySync.value !== '' && isEdit.value) {
                submitChange();
            }
        };
        const showEditable = () => {
            oldValue.value = JSON.parse(JSON.stringify(valueSync.value));
            activeKeySync.value = props.editKey;
        };
        const cancelEditable = () => {
            valueSync.value = oldValue.value;
            activeKeySync.value = '';
        };
        watch(
            () => activeKeySync.value,
            (newVal: string, oldVal: string) => {
                if (newVal === '') {
                    preActiveKey.value = null;
                } else {
                    if (preActiveKey.value == null) {
                        preActiveKey.value = newVal;
                    } else {
                        preActiveKey.value = oldVal;
                        if (props.error === '' && oldValue.value !== valueSync.value) {
                            props.onSubmit();
                        }
                    }
                }
            },
        );

        watch(
            () => valueSync.value,
            (newVal: any) => {
                emit('changeValue', newVal);
            },
        );

        return {
            isEdit,
            valueSync,
            oldValue,
            activeKeySync,
            preActiveKey,
            showEditable,
            cancelEditable,
            submitChange,
            submitChangeByEnter,
            submitClickOutside,
            helper,
        };
    },
};
</script>

<style lang="scss" scoped>
.editable {
    &__composer {
        width: calc(100% - 22px);
        height: 36px;
        &--is-edit {
            width: 100%;
        }
        &.locked {
            width: calc(100% - 22px) !important;
            pointer-events: none;
            user-select: none;
            color: #141417;
        }
        &.disabled {
            position: relative;
            width: calc(100% - 22px) !important;
            pointer-events: none;
            user-select: none;
            color: #141417;
            &:before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(255, 255, 255, 0.7);
            }
        }
    }
    &__button {
        display: none;
        &--show {
            display: flex !important;
        }
    }
    &:hover {
        .editable__composer {
            width: calc(100% - 40px);
        }
        .editable__button {
            display: block;
        }
    }
}
.icon-copy {
    :deep(svg) {
        color: #6b6b7b;
        &:hover {
            color: #3e6dda;
        }
    }
}
</style>
