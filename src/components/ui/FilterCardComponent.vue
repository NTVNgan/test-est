<template>
    <div class="w-full p-16p rounded-4p border border-1 border-neutrals-100 hover:border-primary-500">
        <template
            v-for="(item_condition, index_condition) in filterGroupsSync.conditions"
            :key="'condition-' + item_condition"
        >
            <tooltip-component
                v-if="index_condition !== 0"
                class="inline-flex divider divider__up divider__down"
                position="bottom"
                :content="$t('ui_component.filter_tooltip_switch_operator_title')"
            >
                <switch-component
                    :class="{ 'switch--hover': checkHoverSwitchSync }"
                    @mouseenter="onMouseEnterSwitch"
                    @mouseleave="onMouseLeaveSwitch"
                    v-model="filterGroupsSync.operator"
                    :switchs="switchs"
                />
            </tooltip-component>
            <filter-single-component
                :filtersValue="filtersValue"
                :modelValue="formatFilterValue(item_condition, index_condition)"
                :showOption="showDropdownChild"
                @removeFilter="removeFilter"
                @parseFilterValue="parseFilterValue"
            />
        </template>
        <filter-add-button-component
            v-model:modelValue="attributeSelect"
            v-model:showDropdown="showDropdown"
            :filtersValue="filtersValue"
            class="divider divider__up divider--button"
        >
            <template #button>
                <button-component
                    type="outline"
                    size="medium"
                    isFocus
                    icon="plus"
                    :disabled="disabledButtonAdd"
                    @click="toggleDropdown"
                />
            </template>
        </filter-add-button-component>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import FilterSingleComponent from '@/components/ui/FilterSingleComponent.vue';
import FilterAddButtonComponent from '@/components/ui/FilterAddButtonComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import SwitchComponent from '@/components/ui/SwitchComponent.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import { useI18n } from 'vue-i18n';
export default defineComponent({
    name: 'FilterCardComponent',
    components: {
        FilterSingleComponent,
        FilterAddButtonComponent,
        ButtonComponent,
        SwitchComponent,
        TooltipComponent,
    },
    props: {
        filterGroups: {
            type: Object,
            default: null,
        },
        groupIndex: {
            type: Number,
            default: 0,
        },
        disabledButtonAdd: {
            type: Boolean,
            default: false,
        },
        filterGroupOperator: {
            type: String,
            default: 'AND',
        },
        filterGroupLength: {
            type: Number,
            default: 0,
        },
        checkHoverSwitch: {
            type: Boolean,
            default: false,
        },
        filtersValue: {
            type: Array,
            default: () => [],
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
        const filterOperator = ref<string>('AND');
        const showDropdown = ref<boolean>(false);
        const showDropdownChild = ref<boolean>(false);
        const attributeSelect = ref<any>(null);
        const checkHoverSwitchSync = computed({
            get(): any {
                return props.checkHoverSwitch;
            },
            set(value: any) {
                emit('update:checkHoverSwitch', value);
            },
        });
        const filterGroupsSync = computed({
            get(): any {
                return props.filterGroups;
            },
            set(value: any) {
                emit('update:filterGroups', value);
            },
        });
        const onMouseEnterSwitch = () => {
            emit('onMouseEnter');
        };
        const onMouseLeaveSwitch = () => {
            emit('onMouseLeave');
        };
        const firstOptionByType = (type: number) => {
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
        const formatFilterValue = (condition: any, index: number) => {
            const filter: any = {
                name: '',
                id: '',
                key: '',
                value: null,
                index,
            };
            const conditionKey = Object.keys(condition)[0];
            filter.id = conditionKey.split(':')[0];
            filter.key = conditionKey.split(':')[1];
            filter.value = Object.values(condition)[0];
            const findFilterValue: any = props.filtersValue.find((item: any) => item._id === filter.id);
            if (findFilterValue) {
                filter.name = findFilterValue.name;
            }
            return filter;
        };
        const parseFilterValue = (condition: any) => {
            const filter: any = {};
            filter[`${condition.id}:${condition.key}`] = condition.value;
            filterGroupsSync.value.conditions[condition.index] = filter;
        };
        const removeFilter = (index: any) => {
            filterGroupsSync.value.conditions.splice(index, 1);
            if (filterGroupsSync.value.conditions.length === 0) {
                emit('removeGroup', props.groupIndex);
            }
        };

        watch(
            () => props.filterGroupOperator,
            (newVal: string) => {
                if (newVal === 'AND') {
                    filterGroupsSync.value.operator = 'OR';
                } else {
                    filterGroupsSync.value.operator = 'AND';
                }
            },
        );
        watch(
            () => filterGroupsSync.value.operator,
            (newVal: string) => {
                if (newVal === 'AND') {
                    emit('update:filterGroupOperator', 'OR');
                } else {
                    emit('update:filterGroupOperator', 'AND');
                }
            },
        );
        watch(
            () => attributeSelect.value,
            (newVal: any) => {
                if (newVal === null) return;
                const filter: any = {};
                filter[`${newVal._id}:${firstOptionByType(newVal.datatype)}`] = '';
                if (
                    props.filterGroupLength === 1 &&
                    filterGroupsSync.value.conditions.length === 1 &&
                    filterGroupsSync.value.operator === 'OR'
                ) {
                    filterGroupsSync.value.operator = 'AND';
                }
                filterGroupsSync.value.conditions.push(filter);
                showDropdown.value = false;
            },
        );

        return {
            filterGroupsSync,
            switchs,
            showDropdown,
            toggleDropdown,
            showDropdownChild,
            attributeSelect,
            formatFilterValue,
            parseFilterValue,
            removeFilter,
            checkHoverSwitchSync,
            onMouseEnterSwitch,
            onMouseLeaveSwitch,
            filterOperator,
        };
    },
});
</script>

<style lang="scss"></style>
