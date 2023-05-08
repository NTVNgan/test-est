<template>
    <modal-component
        v-model="showModalSync"
        :closeIcon="false"
        :custom-class="'py-24p'"
        :width="'400px'"
        :maxHeight="'initial'"
        class="model-error-detail z-999"
    >
        <template v-slot:header>
            <div class="flex">
                <span class="font-medium text-16"
                    >{{ sumError }} {{ sumError > 1 ? 'errors' : 'error' }}
                    {{ $t('setting.import_history_modal_count_error_title') }}
                </span>
            </div>
        </template>
        <template v-slot:body>
            <div
                class="px-32p scrollbar--transparent overflow-y-auto check-scrollbar"
                ref="scrollWrapper"
                style="max-height: 507px"
                :class="{ 'pr-16p': isShowScrollbar }"
            >
                <Accordion
                    noBorder
                    class="setting-import-history-accordion"
                    @update:activeIndex="selectTab"
                    :delayTime="true"
                    :fontWeightHeader="'font-normal'"
                    :activeIndex="[activeIndex]"
                    :watchIndex="false"
                >
                    <accordion-tab
                        v-for="(error, index) in defaultTypeError"
                        :key="index"
                        :header="error.title + ' (' + error.count + ')'"
                        :count="error.count"
                        :loading="loading"
                    >
                        <template #icon v-if="index === 5 || index === 7 || index === 8">
                            <Tooltip size="small" position="bottom" type="light">
                                <template #content>
                                    <div v-if="index === 5" class="flex items-center">
                                        <ul class="list-comment-log-history text-neutrals-900 py-8p pl-32p">
                                            <li class="text-14"><b>Full name</b> must be between 6 - 60 characters</li>
                                            <li class="text-14">
                                                <b>Phone number</b> must be between 8 - 20 characters
                                            </li>
                                            <li class="text-14"><b>Customer ID</b> must be less than 100 characters</li>
                                        </ul>
                                    </div>
                                    <div v-else-if="index === 7" class="flex items-center">
                                        <div class="list-comment-log-history text-neutrals-900 py-8p pl-8p pr-24p">
                                            <span class="text-14">
                                                <b>Country code</b> should follow this <br />standardization:
                                                <a
                                                    class="import-link-info text-primary-500"
                                                    href="https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes"
                                                    target="_blank"
                                                >
                                                    {{
                                                        $t(
                                                            'contact.contact_import_modal_upload_file_button_country_code',
                                                        )
                                                    }}
                                                </a></span
                                            >
                                        </div>
                                    </div>
                                    <div v-else-if="index === 8" class="flex items-center">
                                        <div class="list-comment-log-history text-neutrals-900 py-8p pl-8p pr-14p">
                                            <span class="text-14">
                                                <b>Language code</b> should follow this <br />standardization:
                                                <a
                                                    class="import-link-info text-primary-500"
                                                    href="https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes"
                                                    target="_blank"
                                                    >Language code</a
                                                ></span
                                            >
                                        </div>
                                    </div>
                                </template>
                                <Button type="subtle" size="tiny" icon="info-circle-white" class="icon-info"></Button>
                            </Tooltip>
                        </template>
                        <div
                            v-if="errorDetail(error.type).length > 0"
                            class="error-content scrollbar--transparent"
                            @scroll="handleScrollToBottom"
                        >
                            <table class="text-14">
                                <tr>
                                    <th class="font-medium">Row</th>
                                    <th class="font-medium">Column</th>
                                </tr>
                                <tr v-for="(err, k) in errorDetail(error.type)" :key="k">
                                    <td>{{ err.row }}</td>
                                    <td>{{ err.column }}</td>
                                </tr>
                            </table>
                        </div>
                    </accordion-tab>
                </Accordion>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-center">
                <Button size="medium" @click="closeModal">
                    {{ $t('setting.import_history_modal_btn_close') }}
                </Button>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, watch } from 'vue';
import Button from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { useI18n } from 'vue-i18n';
import { useImportHistory } from '@/modules/setting/composables/useImportHistory';
import Accordion from '@/components/ui/AccordionComponent.vue';
import AccordionTab from '@/components/ui/AccordionPanel.vue';
import Tooltip from '@/components/ui/TooltipComponent.vue';

const ERROR = {
    ERROR_EMAIL_ALREADY_EXISTS: 1,
    ERROR_MISSING_FULL_NAME_OR_EMAIL: 3,
    ERROR_INVALID_EMAIL_FORMAT: 5,
    ERROR_INVALID_PHONE_NUMBER_FORMAT: 7,
    ERROR_UNMATCHED_DATA: 9,
    ERROR_SYSTEM_FAIL: 11,
    ERROR_INVALID_LENGTH: 13,
    INVALID_TIMEZONE_VALUE: 15,
    INVALID_LANGUAGE: 17,
    INVALID_COUNTRY: 19,
};

export default defineComponent({
    name: 'SettingImportHistoryModalErrorDetail',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        idHistoryImport: {
            type: String,
            default: '',
        },
    },
    components: {
        Button,
        ModalComponent,
        Accordion,
        AccordionTab,
        Tooltip,
    },
    setup(props, { emit }) {
        const emitter: any = inject('emitter');
        const emailValue = ref<string>('');
        const typeError = ref<string>('');
        const selected = ref<number>(-1);
        const activeIndex = ref<number>(-1);
        const { t } = useI18n();
        const defaultTypeError = ref<Array<any>>([
            {
                type: ERROR.ERROR_EMAIL_ALREADY_EXISTS,
                title: t('setting.import_history_modal_email_already_exists'),
                count: 0,
            },
            {
                type: ERROR.ERROR_MISSING_FULL_NAME_OR_EMAIL,
                title: t('setting.import_history_modal_missing_full_name_or_email'),
                count: 0,
            },
            {
                type: ERROR.ERROR_INVALID_EMAIL_FORMAT,
                title: t('setting.import_history_modal_invalid_email_format'),
                count: 0,
            },
            {
                type: ERROR.ERROR_INVALID_PHONE_NUMBER_FORMAT,
                title: t('setting.import_history_modal_invalid_phone_number_format'),
                count: 0,
            },
            {
                type: ERROR.ERROR_UNMATCHED_DATA,
                title: t('setting.import_history_modal_unmatched_data'),
                count: 0,
            },
            {
                type: ERROR.ERROR_INVALID_LENGTH,
                title: 'Invalid value length',
                count: 0,
            },
            {
                type: ERROR.INVALID_TIMEZONE_VALUE,
                title: 'Invalid timezone value',
                count: 0,
            },
            {
                type: ERROR.INVALID_COUNTRY,
                title: 'Invalid Country code format',
                count: 0,
            },
            {
                type: ERROR.INVALID_LANGUAGE,
                title: 'Invalid Language code format',
                count: 0,
            },
        ]);
        const errorList = ref<Array<any>>([
            {
                type: ERROR.ERROR_EMAIL_ALREADY_EXISTS,
                data: [],
                next_page: '',
                page: 1,
            },
            {
                type: ERROR.ERROR_MISSING_FULL_NAME_OR_EMAIL,
                data: [
                    // {
                    //     row: '1',
                    //     column: '2',
                    // },
                    // {
                    //     row: '3',
                    //     column: '4',
                    // },
                ],
                next_page: '',
                page: 1,
            },
            {
                type: ERROR.ERROR_INVALID_EMAIL_FORMAT,
                data: [],
                next_page: '',
                page: 1,
            },
            {
                type: ERROR.ERROR_INVALID_PHONE_NUMBER_FORMAT,
                data: [],
                next_page: '',
                page: 1,
            },
            {
                type: ERROR.ERROR_UNMATCHED_DATA,
                data: [],
                next_page: '',
                page: 1,
            },
            {
                type: ERROR.ERROR_INVALID_LENGTH,
                data: [],
                next_page: '',
                page: 1,
            },
            {
                type: ERROR.INVALID_TIMEZONE_VALUE,
                data: [],
                next_page: '',
                page: 1,
            },
            {
                type: ERROR.INVALID_COUNTRY,
                data: [],
                next_page: '',
                page: 1,
            },
            {
                type: ERROR.INVALID_LANGUAGE,
                data: [],
                next_page: '',
                page: 1,
            },
        ]);
        const { getImportHistoryErrorDetail, getImportHistoryErrorCount } = useImportHistory();
        const loading = ref<boolean>(false);
        const scrollWrapper = ref<HTMLElement>();
        const isShowScrollbar = ref<boolean>(false);

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const checkShowScrollbar = async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (scrollWrapper.value) {
                if (scrollWrapper.value.scrollHeight > scrollWrapper.value.clientHeight) isShowScrollbar.value = true;
                else isShowScrollbar.value = false;
            }
        };

        const errorDetail = computed(() => {
            return (type: any) => {
                return errorList.value.find(e => e.type === type).data;
            };
        });

        const sumError = computed(() => {
            return defaultTypeError.value.reduce((n, { count }) => n + count, 0);
        });

        const resetData = async () => {
            errorList.value = [
                {
                    type: ERROR.ERROR_EMAIL_ALREADY_EXISTS,
                    data: [],
                    next_page: '',
                    page: 1,
                },
                {
                    type: ERROR.ERROR_MISSING_FULL_NAME_OR_EMAIL,
                    data: [],
                    next_page: '',
                    page: 1,
                },
                {
                    type: ERROR.ERROR_INVALID_EMAIL_FORMAT,
                    data: [],
                    next_page: '',
                    page: 1,
                },
                {
                    type: ERROR.ERROR_INVALID_PHONE_NUMBER_FORMAT,
                    data: [],
                    next_page: '',
                    page: 1,
                },
                {
                    type: ERROR.ERROR_UNMATCHED_DATA,
                    data: [],
                    next_page: '',
                    page: 1,
                },
                {
                    type: ERROR.ERROR_INVALID_LENGTH,
                    data: [],
                    next_page: '',
                    page: 1,
                },
                {
                    type: ERROR.INVALID_TIMEZONE_VALUE,
                    data: [],
                    next_page: '',
                    page: 1,
                },
                {
                    type: ERROR.INVALID_COUNTRY,
                    data: [],
                    next_page: '',
                    page: 1,
                },
                {
                    type: ERROR.INVALID_LANGUAGE,
                    data: [],
                    next_page: '',
                    page: 1,
                },
            ];

            defaultTypeError.value = [
                {
                    type: ERROR.ERROR_EMAIL_ALREADY_EXISTS,
                    title: t('setting.import_history_modal_email_already_exists'),
                    count: 0,
                },
                {
                    type: ERROR.ERROR_MISSING_FULL_NAME_OR_EMAIL,
                    title: t('setting.import_history_modal_missing_full_name_or_email'),
                    count: 0,
                },
                {
                    type: ERROR.ERROR_INVALID_EMAIL_FORMAT,
                    title: t('setting.import_history_modal_invalid_email_format'),
                    count: 0,
                },
                {
                    type: ERROR.ERROR_INVALID_PHONE_NUMBER_FORMAT,
                    title: t('setting.import_history_modal_invalid_phone_number_format'),
                    count: 0,
                },
                {
                    type: ERROR.ERROR_UNMATCHED_DATA,
                    title: t('setting.import_history_modal_unmatched_data'),
                    count: 0,
                },
                {
                    type: ERROR.ERROR_INVALID_LENGTH,
                    title: 'Invalid value length',
                    count: 0,
                },
                {
                    type: ERROR.INVALID_TIMEZONE_VALUE,
                    title: 'Invalid timezone value',
                    count: 0,
                },
                {
                    type: ERROR.INVALID_COUNTRY,
                    title: 'Invalid Country code format',
                    count: 0,
                },
                {
                    type: ERROR.INVALID_LANGUAGE,
                    title: 'Invalid Language code format',
                    count: 0,
                },
            ];
        };

        const closeModal = async () => {
            selected.value = -1;
            activeIndex.value = -1;
            typeError.value = '';
            resetData();
            emit('close');
        };

        const callData = async (newData = false) => {
            let currentErrorNextPage = errorList.value.find(e => e.type === typeError.value).next_page;
            if (typeof currentErrorNextPage == 'undefined' || currentErrorNextPage == undefined)
                currentErrorNextPage = '';
            const currentPage = errorList.value.find(e => e.type === typeError.value).page;
            if (currentPage < 1) return;
            loading.value = true;
            const data = await getImportHistoryErrorDetail({
                type: typeError.value,
                im_id: props.idHistoryImport,
                next_page: currentErrorNextPage,
                page: currentPage,
            });
            loading.value = false;
            if (Array.isArray(data.data)) {
                errorList.value.forEach(e => {
                    if (e.type === parseInt(data.type)) {
                        if (newData) e.data = data.data;
                        else e.data = [...e.data, ...data.data];
                        if (data.data.length == 0) e.page = -1;
                        else e.page++;
                        if (typeof data.next_page != 'undefined') e.next_page = data.next_page;
                    }
                });
            }
            await new Promise(resolve => setTimeout(resolve, 400));
            checkShowScrollbar();
        };

        const selectedError = async (index: any, type: any) => {
            typeError.value = type;
            if (selected.value === index) selected.value = -1;
            else selected.value = index;
            const checkListError = errorList.value.find(e => e.type === type).data;
            if (checkListError.length < 1) {
                await callData(true);
                // const data = await getImportHistoryErrorDetail({
                //     type: type,
                //     im_id: props.idHistoryImport,
                //     next_page: next_page.value,
                // });
                // if (Array.isArray(data.data)) {
                //     errorList.value.forEach(e => {
                //         if (e.type === type) e.data = data.data;
                //     });
                // }
            }
        };

        const selectTab = async (data: any) => {
            checkShowScrollbar();
            if (data.value == null) return;
            await selectedError(data.value, defaultTypeError.value[data.value].type);
        };

        const getCountError = async (idHistoryImport: any) => {
            const data = await getImportHistoryErrorCount({
                im_id: idHistoryImport,
            });
            defaultTypeError.value.forEach(e => {
                if (typeof data.data[e.type] != 'undefined') e.count = data.data[e.type];
            });
        };

        const handleScrollToBottom = async (target: any) => {
            const currentError = errorList.value.find(e => e.type === typeError.value);
            if (typeof currentError == 'undefined') return;
            if (
                currentError.data.length < 50 ||
                currentError.next_page == '' ||
                currentError.next_page == null ||
                currentError.next_page == 'null' ||
                typeof currentError.next_page == 'undefined' ||
                currentError.next_page == undefined
            )
                return;
            if (target.target.scrollTop + target.target.clientHeight >= target.target.scrollHeight) {
                await callData();
            }
        };

        emitter.on('clickErrorImport', async (data: any) => {
            getCountError(data);
        });

        // watch(
        //     () => props.idHistoryImport,
        //     () => {
        //         getCountError(props.idHistoryImport);
        //     },
        //     { deep: true },
        // );

        return {
            emailValue,
            showModalSync,
            closeModal,
            defaultTypeError,
            selected,
            activeIndex,
            selectedError,
            errorDetail,
            sumError,
            ERROR,
            handleScrollToBottom,
            selectTab,
            errorList,
            loading,
            scrollWrapper,
            isShowScrollbar,
        };
    },
});
</script>

<style lang="scss" scoped>
.error-title-detail:last-child {
    margin-bottom: 0;
}
.title-error {
    padding: 6px 8px;
    cursor: pointer;

    .arrow {
        border: solid #3f3f49;
        border-width: 0 1.2px 1.2px 0;
        display: inline-block;
        padding: 2.6px;
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
    }
}

.selected {
    .title-error {
        background: #f6f6f8;
        border-radius: 4px;

        span {
            color: #3e6dda;
            font-weight: 700;
        }

        .arrow {
            border-color: #3e6dda;
            transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
        }

        .right {
            transform: rotate(-45deg);
            -webkit-transform: rotate(-45deg);
        }
    }
}

.error-content {
    padding-right: 8px;
    padding-left: 8px;
    max-height: 192px;
    overflow-y: auto;

    table {
        width: 100%;
        tr {
            height: 32px;
            border-bottom: 1px solid #e9e9ec;
            text-align: left;

            th,
            td {
                padding-left: 16px;
            }
        }

        tr:last-child {
            border-bottom: none;
        }
    }
}
.icon-info {
    display: inherit;
    border: none;
    background: none;

    :deep(svg) {
        width: 21px;
        height: 21px;
        fill: #9b9ba8 !important;
    }
}
.setting-import-history-accordion {
    :deep(.accordion-component__item.mb-4p) {
        margin-bottom: 7px;
    }
    :deep(.accordion-component__item.mb-4p:last-child) {
        margin-bottom: 4px;
    }
    :deep(.is-open .accordion-header) {
        background: #f6f6f8;
    }
    :deep(.is-open .accordion-header__label .p-accordion-header-text) {
        font-weight: 700;
        color: #3e6dda;
    }
    :deep(.is-open .accordion-header svg) {
        color: #3e6dda;
    }
}
.import-link-info {
    text-decoration: underline;
}
</style>
<style>
ul.list-comment-log-history li::before {
    content: '\2022';
    color: #141417;
    font-weight: bold;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
}
</style>
