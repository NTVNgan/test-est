<template>
    <dropdown-component class="w-full" v-click-outside="hideDropdown">
        <template #header>
            <button
                ref="filterEl"
                class="cursor-pointer w-full flex py-8p pl-12p pr-4p rounded-4p border border-1p outline-none focus:outline-none text-left"
                :class="classFilter"
                @click="toggleDropdown"
            >
                <div class="flex-1 text-14 filter-single__text">
                    <span class="font-medium">{{ modelValueSync.name }}</span>
                    <span class="lowercase">&nbsp;{{ conditionName }}</span>
                    <span>&nbsp;{{ conditionValueDisplay }}</span>
                </div>
                <div
                    @click.stop.prevent="removeFilter"
                    class="h-20 w-20 rounded-4p bg-transparent"
                    :class="{ 'hover:bg-neutrals-200 hover:text-white': !disabled }"
                >
                    <icon-component name="times" color="inherit" />
                </div>
            </button>
            <p v-if="error || showError" class="mt-4p text-14 text-error-3">
                {{ $t('ui_component.filter_single_error_text') }}
            </p>
        </template>
        <template #list>
            <div
                ref="dropdownEl"
                v-if="showDropdown"
                :style="{
                    right: dropdownRight !== 'auto' ? `${dropdownRight}px` : dropdownRight,
                    left: dropdownLeft !== 'auto' ? `${dropdownLeft}px` : dropdownLeft,
                    top: dropdownTop !== 'auto' ? `${dropdownTop}px` : dropdownTop,
                    bottom: dropdownBottom !== 'auto' ? `${dropdownBottom}px` : dropdownBottom,
                }"
                class="z-999 relative mb-24p w-full bg-white text-14 rounded-4p shadow-deep-1 font-body filter__list"
            >
                <list-component typeList="radio" maxHeightList="370px" v-model="conditionKey">
                    <list-item-component
                        type="radio"
                        v-for="(item, index) in optionsByType"
                        :key="'filter-option-' + index"
                    >
                        <radio-component
                            :isDatePicker="item.type === 'date_single' || item.type === 'date_range'"
                            :valueRadio="item.key"
                            :nameRadio="'filter-item' + index"
                        >
                            <template #label>{{ item.label }}</template>
                            <template #custom v-if="item.type !== 'boolean'">
                                <template v-if="item.type === 'text'">
                                    <input-component
                                        class="w-full"
                                        state="default"
                                        type="text"
                                        v-model="filterValue.text"
                                        :placeholder="$t('ui_component.filter_single_placeholder_text')"
                                    ></input-component>
                                </template>
                                <template v-if="item.type === 'number'">
                                    <input-component
                                        class="w-full"
                                        state="default"
                                        type="number"
                                        stepper
                                        :placeholder="$t('ui_component.filter_single_placeholder_text')"
                                        v-model="filterValue.number"
                                    ></input-component>
                                </template>
                                <template v-if="item.type === 'number_range'">
                                    <input-component
                                        class="w-full flex-1"
                                        state="default"
                                        type="number"
                                        stepper
                                        :placeholder="$t('ui_component.filter_single_placeholder_text')"
                                        v-model="filterValue.numberRange1"
                                    ></input-component>
                                    <span class="text-14 mx-8p">and</span>
                                    <input-component
                                        class="w-full flex-1"
                                        state="default"
                                        type="number"
                                        stepper
                                        :placeholder="$t('ui_component.filter_single_placeholder_text')"
                                        v-model="filterValue.numberRange2"
                                    ></input-component>
                                </template>
                                <template v-if="item.type === 'date_text'">
                                    <input-component
                                        class="w-full flex-1 mr-8p"
                                        state="default"
                                        type="number"
                                        stepper
                                        :placeholder="$t('ui_component.filter_single_placeholder_text')"
                                        v-model="filterValue.dateText"
                                    ></input-component>
                                    <span class="text-14">day(s) ago</span>
                                </template>
                                <template v-if="item.type === 'date_single'">
                                    <date-picker
                                        class="rounded-4p shadow-deep-1"
                                        :columns="1"
                                        type="single"
                                        v-model="filterValue.dateSingle"
                                    />
                                </template>
                                <template v-if="item.type === 'date_range'">
                                    <date-picker
                                        class="rounded-4p shadow-deep-1"
                                        :columns="1"
                                        type="range"
                                        v-model="filterValue.dateRange"
                                    />
                                </template>
                                <template v-if="item.type === 'select' && modelValueSync.id === 'browser_language'">
                                    <select-component
                                        class="w-full"
                                        v-model="filterValue.text"
                                        showSearch
                                        @isShow="onShowSelect"
                                        heightList="252px"
                                    >
                                        <select-panel-component
                                            v-for="(language, language_index) in languagesList"
                                            :key="`language-${language_index}`"
                                            :value="language.key"
                                        >
                                            {{ language.name }}
                                        </select-panel-component>
                                    </select-component>
                                </template>
                                <template v-if="item.type === 'select' && modelValueSync.id === 'country'">
                                    <select-component
                                        class="w-full"
                                        v-model="filterValue.text"
                                        showSearch
                                        @isShow="onShowSelect"
                                        heightList="252px"
                                    >
                                        <select-panel-component
                                            v-for="(country, country_index) in countriesList"
                                            :key="`country-${country_index}`"
                                            :value="country.key"
                                        >
                                            {{ country.name }}
                                        </select-panel-component>
                                    </select-component>
                                </template>
                            </template>
                        </radio-component>
                    </list-item-component>
                    <template #button>
                        <div class="px-8p">
                            <button-component size="medium" type="primary" @click="hideDropdown">
                                <span>{{ $t('ui_component.filter_single_button_add') }}</span>
                            </button-component>
                        </div>
                    </template>
                </list-component>
            </div>
        </template>
    </dropdown-component>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, computed, watch, onMounted } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import DropdownComponent from '@/components/ui/DropdownComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import ListComponent from '@/components/ui/ListComponent.vue';
import ListItemComponent from '@/components/ui/ListItemComponent.vue';
import InputComponent from '@/components/ui/InputComponent.vue';
import RadioComponent from '@/components/ui/RadioButtonComponent.vue';
import DatePicker from '@/components/ui/DatePickerComponent/index.vue';
import SelectComponent from '@/components/ui/SelectComponent.vue';
import SelectPanelComponent from '@/components/ui/SelectPanel.vue';
import { useCountriesList } from '@/composables/useCountriesList';
import { useI18n } from 'vue-i18n';

interface FilterValue {
    text: string;
    number: string;
    numberRange1: string;
    numberRange2: string;
    dateText: string;
    dateSingle: Date;
    dateRange: {
        start: Date;
        end: Date;
    };
}

export default defineComponent({
    name: 'FilterSingleComponent',
    components: {
        DropdownComponent,
        ButtonComponent,
        IconComponent,
        ListComponent,
        ListItemComponent,
        RadioComponent,
        InputComponent,
        DatePicker,
        SelectComponent,
        SelectPanelComponent,
    },
    props: {
        error: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        showOption: {
            type: Boolean,
            default: false,
        },
        filtersValue: {
            type: Array,
            default: () => [],
        },
        modelValue: {
            type: Object,
            default: null,
        },
    },
    setup(props, { emit }) {
        const showError = ref<boolean>(false);
        const showDropdown = ref<boolean>(false);
        const showSelect = ref<boolean>(false);
        const filterEl = ref<HTMLElement>();
        const dropdownEl = ref<HTMLElement>();
        const dropdownRight = ref<number | string>('auto');
        const dropdownLeft = ref<number | string>('auto');
        const dropdownTop = ref<number | string>('auto');
        const dropdownBottom = ref<number | string>('auto');
        const booleanKey = ref(['unknown', 'has_any', 'true_equal', 'false_equal', 'dt_unknown', 'dt_has_any']);
        const booleanTrueKey = ref(['unknown', 'has_any', 'true_equal', 'dt_unknown', 'dt_has_any']);
        const booleanFalseKey = ref(['false_equal']);
        const dateTextKey = ref(['dt_is', 'dt_more_than', 'dt_less_than']);
        const dateSingleKey = ref(['dt_lt', 'dt_gt', 'equal']);
        const { t } = useI18n();
        const { countriesList, languagesList, getCountryName, getLanguagesName } = useCountriesList();

        const modelValueSync = computed({
            get(): any {
                return props.modelValue;
            },
            set(value: any) {
                emit('update:modelValue', value);
            },
        });
        const conditionKey = ref<string>('');
        const filterValue = ref<FilterValue>({
            text: '',
            number: '0',
            numberRange1: '0',
            numberRange2: '0',
            dateText: '0',
            dateSingle: new Date(),
            dateRange: {
                start: new Date(),
                end: new Date(),
            },
        });

        const classFilter = computed(() => {
            return {
                'bg-error-5 border-error-3 ring-error': props.error || showError.value,
                'bg-neutrals-50 border-neutrals-50 text-neutrals-300 cursor-not-allowed': props.disabled,
                'bg-neutrals-100 border-neutrals-100 focus:bg-white focus:border-primary-500':
                    !props.disabled && !props.error && !showError.value && !showDropdown.value,
                'bg-white border-primary-500': showDropdown.value,
            };
        });
        const filterType = computed(() => {
            const findFilterValue: any = props.filtersValue.find((item: any) => item._id === props.modelValue.id);
            if (findFilterValue) {
                return findFilterValue.datatype;
            }
            return '';
        });
        const optionsByType = computed(() => {
            switch (filterType.value) {
                case 3: // date
                    return [
                        {
                            label: t('ui_component.filter_single_option_is_before'),
                            key: 'dt_lt',
                            value: 'dt_lt',
                            type: 'date_single',
                        },
                        {
                            label: t('ui_component.filter_single_option_is_after'),
                            key: 'dt_gt',
                            value: 'dt_gt',
                            type: 'date_single',
                        },
                        {
                            label: t('ui_component.filter_single_option_is_on'),
                            key: 'equal',
                            value: 'equal',
                            type: 'date_single',
                        },
                        {
                            label: t('ui_component.filter_single_option_is_between'),
                            key: 'dt_between',
                            value: 'dt_between',
                            type: 'date_range',
                        },
                        {
                            label: t('ui_component.filter_single_option_more_than'),
                            key: 'dt_less_than',
                            value: 'dt_less_than',
                            type: 'date_text',
                        },
                        // {
                        //     label: t('ui_component.filter_single_option_is'),
                        //     key: 'dt_is',
                        //     value: 'dt_is',
                        //     type: 'date_text',
                        // },
                        {
                            label: t('ui_component.filter_single_option_less_than'),
                            key: 'dt_more_than',
                            value: 'dt_more_than',
                            type: 'date_text',
                        },
                        {
                            label: t('ui_component.filter_single_option_is_unknown'),
                            key: 'dt_unknown',
                            value: 'dt_unknown',
                            type: 'boolean',
                        },
                        {
                            label: t('ui_component.filter_single_option_has_any_value'),
                            key: 'dt_has_any',
                            value: 'dt_has_any',
                            type: 'boolean',
                        },
                    ];
                case 5: // number
                    return [
                        {
                            label: t('ui_component.filter_single_option_is'),
                            key: 'equal',
                            value: 'equal',
                            type: 'number',
                        },
                        {
                            label: t('ui_component.filter_single_option_is_not'),
                            key: 'not_equal',
                            value: 'not_equal',
                            type: 'number',
                        },
                        {
                            label: t('ui_component.filter_single_option_is_between'),
                            key: 'between',
                            value: 'between',
                            type: 'number_range',
                        },
                        {
                            label: t('ui_component.filter_single_option_greater_than'),
                            key: 'gt',
                            value: 'gt',
                            type: 'number',
                        },
                        {
                            label: t('ui_component.filter_single_option_less_than'),
                            key: 'lt',
                            value: 'lt',
                            type: 'number',
                        },
                        {
                            label: t('ui_component.filter_single_option_is_unknown'),
                            key: 'unknown',
                            value: 'unknown',
                            type: 'boolean',
                        },
                        {
                            label: t('ui_component.filter_single_option_has_any_value'),
                            key: 'has_any',
                            value: 'has_any',
                            type: 'boolean',
                        },
                    ];
                case 7: // boolean
                    return [
                        {
                            label: t('ui_component.filter_single_option_true'),
                            key: 'true_equal',
                            value: 'equal',
                            type: 'boolean',
                        },
                        {
                            label: t('ui_component.filter_single_option_false'),
                            key: 'false_equal',
                            value: 'equal',
                            type: 'boolean',
                        },
                        {
                            label: t('ui_component.filter_single_option_is_unknown'),
                            key: 'unknown',
                            value: 'unknown',
                            type: 'boolean',
                        },
                        {
                            label: t('ui_component.filter_single_option_has_any_value'),
                            key: 'has_any',
                            value: 'has_any',
                            type: 'boolean',
                        },
                    ];
                case 'select': // select
                    return [
                        {
                            label: t('ui_component.filter_single_option_is'),
                            key: 'text_equal',
                            value: 'text_equal',
                            type: 'select',
                        },
                        {
                            label: t('ui_component.filter_single_option_is_not'),
                            key: 'text_not_equal',
                            value: 'text_not_equal',
                            type: 'select',
                        },
                        {
                            label: t('ui_component.filter_single_option_is_unknown'),
                            key: 'unknown',
                            value: 'unknown',
                            type: 'boolean',
                        },
                        {
                            label: t('ui_component.filter_single_option_has_any_value'),
                            key: 'has_any',
                            value: 'has_any',
                            type: 'boolean',
                        },
                    ];
                default:
                    //type === 1 text
                    return [
                        {
                            label: t('ui_component.filter_single_option_is'),
                            key: 'text_equal',
                            value: 'text_equal',
                            type: 'text',
                        },
                        {
                            label: t('ui_component.filter_single_option_is_not'),
                            key: 'text_not_equal',
                            value: 'text_not_equal',
                            type: 'text',
                        },
                        {
                            label: t('ui_component.filter_single_option_contains'),
                            key: 'contains',
                            value: 'contains',
                            type: 'text',
                        },
                        {
                            label: t('ui_component.filter_single_option_does_not_contains'),
                            key: 'not_contain',
                            value: 'not_contain',
                            type: 'text',
                        },
                        {
                            label: t('ui_component.filter_single_option_is_unknown'),
                            key: 'unknown',
                            value: 'unknown',
                            type: 'boolean',
                        },
                        {
                            label: t('ui_component.filter_single_option_has_any_value'),
                            key: 'has_any',
                            value: 'has_any',
                            type: 'boolean',
                        },
                    ];
            }
        });
        const conditionValue = computed(() => {
            const findCondition: any = optionsByType.value.find((item: any) => item.key === conditionKey.value);
            if (findCondition) {
                return findCondition.value;
            }
            return '';
        });
        const conditionName = computed(() => {
            const findCondition: any = optionsByType.value.find((item: any) => item.key === conditionKey.value);
            if (findCondition) {
                return findCondition.label;
            }
            return '';
        });
        const conditionValueDisplay = computed(() => {
            if (booleanKey.value.includes(conditionKey.value)) {
                return '';
            }
            if (
                filterType.value === 1 &&
                !booleanKey.value.includes(conditionKey.value) &&
                typeof modelValueSync.value.value === 'boolean'
            ) {
                return '';
            }
            if (filterType.value === 3 && dateTextKey.value.includes(conditionKey.value)) {
                if (filterValue.value.dateText !== '') {
                    return `${filterValue.value.dateText} ${t('ui_component.filter_single_text_day_ago')}`;
                }
                return '';
            }
            if (filterType.value === 3 && dateSingleKey.value.includes(conditionKey.value)) {
                if (filterValue.value.dateSingle) {
                    return `${filterValue.value.dateSingle.toLocaleDateString()}`;
                }
                return '';
            }
            if (filterType.value === 3 && conditionKey.value === 'dt_between') {
                return `${filterValue.value.dateRange.start.toLocaleDateString()} ${t(
                    'ui_component.filter_single_text_and',
                )} ${filterValue.value.dateRange.end.toLocaleDateString()}`;
            }
            if (filterType.value === 5 && conditionKey.value === 'between') {
                if (filterValue.value.numberRange1 === '' || filterValue.value.numberRange1 === '') {
                    return '';
                }
                return `${filterValue.value.numberRange1} ${t('ui_component.filter_single_text_and')} ${
                    filterValue.value.numberRange2
                }`;
            }
            if (filterType.value === 'select') {
                if (modelValueSync.value.id === 'browser_language') {
                    return getLanguagesName(modelValueSync.value.value);
                }
                if (modelValueSync.value.id === 'country') {
                    return getCountryName(modelValueSync.value.value);
                }
            }
            return modelValueSync.value.value;
        });

        const formatDate = (date: any) => {
            return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(
                -2,
            )}`;
        };
        const setValue = () => {
            if (modelValueSync.value.key === 'equal' && modelValueSync.value.value === true) {
                conditionKey.value = 'true_equal';
            } else if (modelValueSync.value.key === 'equal' && modelValueSync.value.value === false) {
                conditionKey.value = 'false_equal';
            } else {
                conditionKey.value = modelValueSync.value.key;
            }
            if (filterType.value === 1) {
                if (booleanKey.value.includes(modelValueSync.value.key)) {
                    filterValue.value.text = '';
                } else {
                    filterValue.value.text = modelValueSync.value.value;
                }
            }
            if (filterType.value === 'select' && modelValueSync.value.id === 'browser_language') {
                if (modelValueSync.value.value === '') {
                    filterValue.value.text = languagesList.value[0].key;
                } else {
                    filterValue.value.text = modelValueSync.value.value;
                }
            }
            if (filterType.value === 'select' && modelValueSync.value.id === 'country') {
                if (modelValueSync.value.value === '') {
                    filterValue.value.text = countriesList.value[0].key;
                } else {
                    filterValue.value.text = modelValueSync.value.value;
                }
            }
            if (filterType.value === 3) {
                if (dateTextKey.value.includes(conditionKey.value)) {
                    filterValue.value.dateText = modelValueSync.value.value.split('|')[0].substring(1)
                        ? modelValueSync.value.value.split('|')[0].substring(1)
                        : '0';
                }
                if (dateSingleKey.value.includes(conditionKey.value)) {
                    if (modelValueSync.value.value === '') {
                        filterValue.value.dateSingle = new Date();
                    } else {
                        filterValue.value.dateSingle = new Date(modelValueSync.value.value);
                    }
                }
                if (conditionKey.value === 'dt_between') {
                    filterValue.value.dateRange.start = new Date(modelValueSync.value.value.split('|')[0]);
                    filterValue.value.dateRange.end = new Date(modelValueSync.value.value.split('|')[1]);
                }
            }
            if (filterType.value === 5) {
                if (conditionKey.value === 'between') {
                    filterValue.value.numberRange1 = modelValueSync.value.value.split('|')[0];
                    filterValue.value.numberRange2 = modelValueSync.value.value.split('|')[1];
                } else {
                    filterValue.value.number = modelValueSync.value.value.toString();
                }
            }
        };
        const addValue = () => {
            if (filterType.value === 1 || filterType.value === 'select') {
                modelValueSync.value.value = filterValue.value.text;
            }
            if (filterType.value === 3) {
                if (dateTextKey.value.includes(conditionKey.value)) {
                    if (filterValue.value.dateText === '') {
                        modelValueSync.value.value = '';
                    } else {
                        modelValueSync.value.value = `{${filterValue.value.dateText}|${t(
                            'ui_component.filter_single_text_day',
                        )}}`;
                    }
                }
                if (dateSingleKey.value.includes(conditionKey.value)) {
                    modelValueSync.value.value = formatDate(filterValue.value.dateSingle);
                }
                if (conditionKey.value === 'dt_between') {
                    modelValueSync.value.value = `${formatDate(filterValue.value.dateRange.start)}|${formatDate(
                        filterValue.value.dateRange.end,
                    )}`;
                }
            }
            if (filterType.value === 5) {
                if (conditionKey.value === 'between') {
                    if (filterValue.value.numberRange1 === '' || filterValue.value.numberRange1 === '') {
                        modelValueSync.value.value = '';
                    } else {
                        modelValueSync.value.value = `${filterValue.value.numberRange1}|${filterValue.value.numberRange2}`;
                    }
                } else {
                    modelValueSync.value.value = Number(filterValue.value.number);
                }
            }
            if (booleanTrueKey.value.includes(conditionKey.value)) {
                modelValueSync.value.value = true;
            }
            if (booleanFalseKey.value.includes(conditionKey.value)) {
                modelValueSync.value.value = false;
            }
            showDropdown.value = false;
            emit('parseFilterValue', modelValueSync.value);
        };
        const removeFilter = () => {
            emit('removeFilter', modelValueSync.value.index);
        };
        const setPositionDropdown = () => {
            if (dropdownEl.value && filterEl.value) {
                dropdownTop.value = 4;
                dropdownBottom.value = 'auto';
                dropdownEl.value.style.width = `${filterEl.value.getBoundingClientRect().width}px`;
            }
        };
        const hideDropdown = () => {
            if (!showSelect.value) {
                showDropdown.value = false;
            }
        };
        const toggleDropdown = async () => {
            showDropdown.value = !showDropdown.value;
            await nextTick();
            setPositionDropdown();
        };

        const onShowSelect = (value: any) => {
            showSelect.value = value;
        };

        watch(
            () => showDropdown.value,
            (newVal: boolean) => {
                if (!newVal) {
                    addValue();
                }
                if (!newVal && props.modelValue.value === '') {
                    showError.value = true;
                } else {
                    showError.value = false;
                }
            },
        );
        watch(
            () => conditionKey.value,
            () => {
                modelValueSync.value.key = conditionValue.value;
            },
        );
        watch(
            () => props.modelValue,
            (newVal: any, oldVal: any) => {
                if (JSON.stringify(newVal) !== JSON.stringify(oldVal) && typeof oldVal !== 'undefined') {
                    setValue();
                    if (!showDropdown.value && props.modelValue.value === '') {
                        showError.value = true;
                    } else {
                        showError.value = false;
                    }
                }
                if (typeof oldVal === 'undefined' && newVal.value === '') {
                    setTimeout(async () => {
                        showDropdown.value = true;
                        await nextTick();
                        setPositionDropdown();
                    }, 0);
                }
            },
            { immediate: true },
        );

        onMounted(() => {
            setValue();
            // if (!modelValueSync.value.value) {
            //     setTimeout(async () => {
            //         showDropdown.value = true;
            //         await nextTick();
            //         setPositionDropdown();
            //     }, 0);
            // }
        });

        return {
            filterType,
            conditionValue,
            conditionName,
            conditionKey,
            filterValue,
            modelValueSync,
            classFilter,
            showDropdown,
            dropdownEl,
            filterEl,
            dropdownRight,
            dropdownLeft,
            dropdownTop,
            dropdownBottom,
            optionsByType,
            toggleDropdown,
            hideDropdown,
            addValue,
            conditionValueDisplay,
            removeFilter,
            showError,
            countriesList,
            languagesList,
            onShowSelect,
            showSelect,
        };
    },
});
</script>

<style lang="scss" scoped>
.ring-error {
    outline: 0;
    box-shadow: 0 0 0 2px #ffe5e5;
}
.filter__list {
    :deep(.radio-component) {
        > label {
            width: 100%;
        }
    }
    ::deep(.custom-select-component) {
        max-width: unset;
    }
}
.filter-single__text {
    width: calc(100% - 20px);
    word-break: break-word;
}
</style>
