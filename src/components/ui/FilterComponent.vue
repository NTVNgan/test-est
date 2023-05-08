<template>
    <template v-if="filtersSync !== null">
        <template v-for="(item_group, index_group) in filtersSync.groups" :key="'filter-' + index_group">
            <tooltip-component
                v-if="index_group !== 0"
                class="inline-flex divider divider__up divider__down divider--large"
                position="bottom"
                :content="$t('ui_component.filter_tooltip_switch_operator_title')"
            >
                <switch-component
                    v-model="filtersSync.operator"
                    :switchs="switchs"
                    type="primary"
                    @mouseenter="onMouseEnterSwitch"
                    @mouseleave="onMouseLeaveSwitch"
                    :class="{ 'switch--hover-primary': checkHoverSwitch }"
                />
            </tooltip-component>
            <filter-card-component
                @removeGroup="removeGroup"
                :groupIndex="index_group"
                v-model:filterGroupOperator="filtersSync.operator"
                :filterGroupLength="filtersSync.groups.length"
                :filterGroups="item_group"
                :filtersValue="filtersValue"
                :disabledButtonAdd="disabledButtonAdd"
                :checkHoverSwitch="checkHoverSwitch"
                @onMouseEnter="onMouseEnterSwitch"
                @onMouseLeave="onMouseLeaveSwitch"
            />
        </template>
    </template>
    <filter-add-button-component
        v-model:modelValue="attributeGroupSelect"
        v-model:showDropdown="showDropdown"
        :filtersValue="filtersValue"
        :class="{ 'divider divider__up divider--button-large': checkStateButton }"
    >
        <template #button>
            <button-component
                :disabled="disabledButtonAdd"
                type="secondary"
                size="medium"
                isFocus
                @click="toggleDropdown"
            >
                {{
                    checkStateButton
                        ? $t('ui_component.filter_button_add_more_group')
                        : $t('ui_component.filter_button_add_filter')
                }}
            </button-component>
        </template>
    </filter-add-button-component>
    <div v-if="showEmptyFilter" class="absolute top-30% left-0 right-0 flex flex-col items-center">
        <img class="logo" src="@/assets/images/no-filter.svg" alt="banner" />
        <p class="font-bold font-16">{{ $t('ui_component.filter_empty_text') }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted } from 'vue';
import FilterCardComponent from '@/components/ui/FilterCardComponent.vue';
import FilterAddButtonComponent from '@/components/ui/FilterAddButtonComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import SwitchComponent from '@/components/ui/SwitchComponent.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import { useI18n } from 'vue-i18n';
export default defineComponent({
    name: 'FilterComponent',
    components: {
        FilterCardComponent,
        FilterAddButtonComponent,
        ButtonComponent,
        SwitchComponent,
        TooltipComponent,
    },
    props: {
        filters: {
            type: Object,
            default: null,
        },
        filtersValue: {
            type: Array,
            default: () => [],
        },
        showDrawerSync: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        const { t } = useI18n();
        const switchs = ref([
            {
                label: t('ui_component.filter_switch_and'),
                value: 'AND',
            },
            {
                label: t('ui_component.filter_switch_or'),
                value: 'OR',
            },
        ]);
        const showDropdown = ref<boolean>(false);
        const checkHoverSwitch = ref<boolean>(false);
        const attributeGroupSelect = ref<any>(null);
        const filtersSync = computed({
            get(): any {
                return props.filters;
            },
            set(value: any) {
                emit('update:filters', value);
            },
        });

        const countConditionFilter = computed(() => {
            let count = 0;
            if (filtersSync.value !== null && filtersSync.value.groups.length) {
                for (let index = 0; index < filtersSync.value.groups.length; index++) {
                    const element = filtersSync.value.groups[index];
                    count += element.conditions.length;
                }
            }
            return count;
        });
        const disabledButtonAdd = computed(() => {
            if (countConditionFilter.value === 25) {
                return true;
            }
            return false;
        });
        const checkStateButton = computed(() => {
            if (filtersSync.value !== null && filtersSync.value.groups.length) {
                return true;
            }
            return false;
        });
        const showEmptyFilter = computed(() => {
            if (!showDropdown.value && filtersSync.value === null) {
                return true;
            }
            if (!showDropdown.value && filtersSync.value !== null && filtersSync.value.groups.length === 0) {
                return true;
            }
            if ((showDropdown.value && filtersSync.value === null) || filtersSync.value !== null) {
                return false;
            }
            if (showDropdown.value && filtersSync.value !== null && filtersSync.value.groups.length > 0) {
                return false;
            }
            return false;
        });

        const onMouseEnterSwitch = () => {
            checkHoverSwitch.value = true;
        };
        const onMouseLeaveSwitch = () => {
            checkHoverSwitch.value = false;
        };
        const firstKeyByType = (type: number) => {
            switch (type) {
                case 3:
                    return 'dt_lt';
                case 5:
                    return 'equal';
                case 7:
                    return 'true_equal';
                default:
                    return 'text_equal';
            }
        };
        const toggleDropdown = () => {
            showDropdown.value = !showDropdown.value;
        };
        const removeGroup = (index: number) => {
            filtersSync.value.groups.splice(index, 1);
        };

        watch(
            () => props.showDrawerSync,
            (newVal: boolean) => {
                if (newVal && props.filters === null) {
                    filtersSync.value = {
                        operator: 'AND',
                        groups: [],
                    };
                    setTimeout(() => {
                        showDropdown.value = true;
                    }, 0);
                }
                if (newVal && props.filters !== null) {
                    filtersSync.value = JSON.parse(JSON.stringify(props.filters));
                }
            },
        );
        watch(
            () => attributeGroupSelect.value,
            (newVal: any) => {
                if (newVal === null) return;
                const filter: any = {};
                filter[`${newVal._id}:${firstKeyByType(newVal.datatype)}`] = '';
                if (
                    filtersSync.value.operator === 'OR' &&
                    filtersSync.value.groups.length > 0 &&
                    filtersSync.value.groups[0].conditions.length === 1
                ) {
                    filtersSync.value.operator = 'AND';
                    filtersSync.value.groups.push({
                        operator: 'OR',
                        conditions: [filter],
                    });
                }
                if (filtersSync.value.operator === 'AND') {
                    filtersSync.value.groups.push({
                        operator: 'OR',
                        conditions: [filter],
                    });
                }
                if (filtersSync.value.operator === 'OR') {
                    filtersSync.value.groups.push({
                        operator: 'AND',
                        conditions: [filter],
                    });
                }
                showDropdown.value = false;
            },
        );

        onMounted(() => {
            if (props.filters === null) {
                showDropdown.value = true;
            }
        });

        return {
            filtersSync,
            checkStateButton,
            switchs,
            showDropdown,
            toggleDropdown,
            attributeGroupSelect,
            showEmptyFilter,
            removeGroup,
            countConditionFilter,
            disabledButtonAdd,
            checkHoverSwitch,
            onMouseEnterSwitch,
            onMouseLeaveSwitch,
        };
    },
});
</script>

<style lang="scss">
.divider {
    position: relative;
    display: inline-block;
    &__up {
        margin-top: 10px;
        &:before {
            content: '';
            position: absolute;
            bottom: calc(100% - 2px);
            left: 50%;
            height: 12px;
            width: 1px;
            background-color: #e9e9ec;
            transform: translateX(-50%);
        }
    }
    &__down {
        margin-bottom: 10px;
        &:after {
            content: '';
            position: absolute;
            top: calc(100% - 2px);
            left: 50%;
            height: 12px;
            width: 1px;
            background-color: #e9e9ec;
            transform: translateX(-50%);
        }
    }
    &--large {
        &.divider__up {
            margin-top: 14px;
            &:before {
                height: 16px;
            }
        }
        &.divider__down {
            margin-bottom: 14px;
            &:after {
                height: 16px;
            }
        }
        &:hover {
            &.divider__up {
                margin-top: 14px;
                &:before {
                    height: 14px;
                    bottom: 100%;
                }
            }
            &.divider__down {
                margin-bottom: 14px;
                &:after {
                    height: 14px;
                    top: 100%;
                }
            }
        }
    }
    &--button {
        &.divider__up {
            margin-top: 12px;
            &:before {
                bottom: 100%;
                height: 12px;
            }
        }
        &.divider__down {
            margin-bottom: 12px;
            &:after {
                height: 12px;
            }
        }
    }
    &--button-large {
        &.divider__up {
            margin-top: 24px;
            &:before {
                left: 34px;
                bottom: 100%;
                transform: none;
                height: 24px;
            }
        }
        &.divider__down {
            margin-bottom: 24px;
            &:after {
                left: 34px;
                transform: none;
                height: 24px;
            }
        }
    }
}
</style>
