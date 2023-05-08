<template>
    <div class="flex items-center justify-between">
        <p class="text-14 font-medium">Reply time</p>
        <tooltip-component
            class="inline-flex text-neutrals-400"
            size="small"
            type="light"
            position="top"
            :content="selectReplyTime"
        >
            <new-dropdown-component
                v-model="showListReplyTime"
                width="328px"
                position="bottom"
                :paddingRange="4"
                borderRadiusContent="4px"
                @clickOutsideContent="clickOutsideContent"
            >
                <div class="">
                    <button
                        class="
                            cursor-pointer
                            flex
                            items-center
                            justify-between
                            py-8p
                            pl-12p
                            pr-4p
                            rounded-4p
                            border border-1p border-neutrals-200
                            outline-none
                            focus:outline-none
                            text-left text-neutrals-900
                            btn-reply-time
                        "
                    >
                        <p class="truncate text-14">{{ selectReplyTime }}</p>
                        <icon-component class="w-20 h-20" name="angle-down" />
                    </button>
                </div>
                <template #content>
                    <list-component typeList="radio" v-model="valueReplyTime" class="list-reply-time">
                        <list-item-component type="radio">
                            <Radio valueRadio="In a few minutes" nameRadio="groupReply">
                                <template v-slot:label>Typically reply in a few minutes</template>
                            </Radio>
                        </list-item-component>
                        <list-item-component type="radio">
                            <Radio valueRadio="In a few hours" nameRadio="groupReply">
                                <template v-slot:label>Typically reply in a few hours</template>
                            </Radio>
                        </list-item-component>
                        <list-item-component type="radio">
                            <Radio valueRadio="In a few day" nameRadio="groupReply">
                                <template v-slot:label>Typically reply in a day</template>
                            </Radio>
                        </list-item-component>
                        <list-item-component type="radio">
                            <Radio valueRadio="Other" nameRadio="groupReply">
                                <template v-slot:label>Other</template>
                                <template v-slot:custom>
                                    <input-component
                                        class="w-full"
                                        v-model.trim="otherReplyTime"
                                        textarea
                                        type="text"
                                        counter
                                        :maxlength="50"
                                        placeholder="Type your reply time"
                                        ref="replyTime"
                                    ></input-component>
                                </template>
                            </Radio>
                        </list-item-component>
                        <template v-slot:button>
                            <button-component
                                :disabled="disabledApply"
                                :size="'medium'"
                                :type="'primary'"
                                @click="applyValueReplyTime"
                            >
                                <span>Apply</span>
                            </button-component>
                        </template>
                    </list-component>
                </template>
            </new-dropdown-component>
        </tooltip-component>
    </div>
    <div class="flex items-center justify-between mt-40p">
        <p class="text-14 font-medium">Workspace timezone</p>
        <select-component
            class="workspace-timezone"
            v-model="widgetSettingDataSync.timezone"
            showSearch
            maxHeightList="188px"
            placeholder="Search timezone"
            @callData="onCallTimezoneBySearch"
            :loadMore="true"
            :clearIcon="false"
            :titleDefault="formatTimezone(widgetSettingDataSync.timezone_label)"
            @change="onChangeTimezone"
            :showTitleDefault="true"
            :isShowIconDown="true"
        >
            <select-panel v-for="(item, index) in listTimezone" :key="index" :value="item.tzCode">
                {{ formatTimezone(item.label) }}
            </select-panel>
        </select-component>
    </div>
    <div class="mt-40p">
        <p class="text-14 font-medium">Office hours</p>
        <p class="text-14 text-neutrals-500 mt-2p">
            Let customer know when your company is available to contact. We will automatically converted based on the
            timezone of customer.
        </p>
        <radio-component
            class="mt-12p"
            valueRadio="247"
            v-model="officeHours"
            nameRadio="247"
            @change="onChangeOfficeHours"
        >
            <template v-slot:label> 24/7 </template>
        </radio-component>
        <radio-component
            class="mt-12p radio-custom-hour"
            valueRadio="custom"
            v-model="officeHours"
            nameRadio="custom"
            @change="onChangeOfficeHours"
        >
            <template v-slot:label>
                <div class="flex justify-between">
                    <span>Custom hours</span>
                    <span
                        class="flex text-14 font-medium"
                        v-if="showBtnResetHour && officeHours == 'custom'"
                        @click="resetHour"
                    >
                        <icon-component name="undo" class="mr-4p" />
                        Reset to default
                    </span>
                </div>
            </template>
        </radio-component>
        <div class="mt-8p ml-26p" v-if="officeHours === 'custom'">
            <div
                v-for="(item, index) in defaultOfficeHours"
                :key="item"
                class="flex items-center justify-between"
                :class="{ 'mt-8p': index > 0 }"
            >
                <CheckBoxCustom
                    class="min-w-0 flex-1"
                    :value="item.day"
                    name="officeHour"
                    v-model="selectedOfficeHours"
                    @change="changeOfficeHours"
                >
                    <template v-slot:label>{{ item.day }}</template>
                </CheckBoxCustom>
                <div class="flex items-center">
                    <select-component
                        class="select__button-hours"
                        v-model="item.valueStart"
                        showSearch
                        maxHeightList="152px"
                        placeholder="Start time"
                        :disabled="item.disable"
                        :error="item.errorStart"
                        @change="onChangeTimeStart(item)"
                        :clearIcon="false"
                    >
                        <select-panel v-for="(item, i) in timePicker" :key="i" :value="item.minutes">
                            {{ item.time }}
                        </select-panel>
                    </select-component>
                    <span class="mx-12p text-14" :class="{ 'text-neutrals-300': item.disable }">to</span>
                    <select-component
                        class="select__button-hours"
                        v-model="item.valueEnd"
                        showSearch
                        maxHeightList="152px"
                        placeholder="End time"
                        :disabled="item.disable"
                        :error="item.errorEnd"
                        @change="onChangeTimeEnd(item)"
                        :clearIcon="false"
                    >
                        <select-panel v-for="(item, i) in timePicker" :key="i" :value="item.minutes">
                            {{ item.time }}
                        </select-panel>
                    </select-component>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import SelectComponent from '@/components/ui/SelectComponent.vue';
import SelectPanel from '@/components/ui/SelectPanel.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import NewDropdownComponent from '@/components/ui/NewDropdownComponent.vue';
import ListComponent from '@/components/ui/ListComponent.vue';
import ListItemComponent from '@/components/ui/ListItemComponent.vue';
import RadioComponent from '@/components/ui/RadioButtonComponent.vue';
import CheckBoxCustom from '@/components/ui/CheckboxCustom.vue';
import Radio from '@/components/ui/RadioButtonComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import InputComponent from '@/components/ui/InputComponent.vue';
import { timePicker } from '../../constant/timePicker';
import { useChatWidget } from '../../composables/useChatWidget';

export default {
    name: 'SettingChatWidgetAccordionTime',
    components: {
        SelectComponent,
        SelectPanel,
        TooltipComponent,
        IconComponent,
        NewDropdownComponent,
        ListComponent,
        ListItemComponent,
        RadioComponent,
        CheckBoxCustom,
        Radio,
        ButtonComponent,
        InputComponent,
    },
    props: {
        widgetSettingData: {
            type: Object,
            default: null,
        },
        discardData: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:widgetSettingData', 'disableSave', 'update:discardData'],
    setup(props: any, { emit }: any) {
        const showListReplyTime = ref<boolean>(false);
        const officeHours = ref<string>('');
        const selectedOfficeHours = ref<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
        const valueReplyTime = ref<string>('In a few minutes');
        // const valueReplyTimeClone = ref<string>('');
        const otherReplyTime = ref<string>('');
        const { getTimezone } = useChatWidget();
        const nextPage = ref<number>(1);
        const listTimezone = ref<any[]>([]);
        const totalPageTimezone = ref<number>(0);
        const selectReplyTime = ref<string>('');
        const disabledApply = ref<boolean>(false);
        const replyTime = ref<any>(null);
        const showBtnResetHour = ref<boolean>(false);
        const selectedOfficeHoursClone = ref<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);

        const defaultOfficeHours = ref<any>([
            {
                day: 'Monday',
                valueStart: 540,
                errorStart: false,
                valueEnd: 1080,
                errorEnd: false,
                disable: false,
            },
            {
                day: 'Tuesday',
                valueStart: 540,
                errorStart: false,
                valueEnd: 1080,
                errorEnd: false,
                disable: false,
            },
            {
                day: 'Wednesday',
                valueStart: 540,
                errorStart: false,
                valueEnd: 1080,
                errorEnd: false,
                disable: false,
            },
            {
                day: 'Thursday',
                valueStart: 540,
                errorStart: false,
                valueEnd: 1080,
                errorEnd: false,
                disable: false,
            },
            {
                day: 'Friday',
                valueStart: 540,
                errorStart: false,
                valueEnd: 1080,
                errorEnd: false,
                disable: false,
            },
            {
                day: 'Saturday',
                valueStart: 540,
                errorStart: false,
                valueEnd: 1080,
                errorEnd: false,
                disable: true,
            },
            {
                day: 'Sunday',
                valueStart: 540,
                errorStart: false,
                valueEnd: 1080,
                errorEnd: false,
                disable: true,
            },
        ]);

        const defaultOfficeHoursClone = ref<any>([
            {
                day: 'Monday',
                valueStart: 540,
                errorStart: false,
                valueEnd: 1080,
                errorEnd: false,
                disable: false,
            },
            {
                day: 'Tuesday',
                valueStart: 540,
                errorStart: false,
                valueEnd: 1080,
                errorEnd: false,
                disable: false,
            },
            {
                day: 'Wednesday',
                valueStart: 540,
                errorStart: false,
                valueEnd: 1080,
                errorEnd: false,
                disable: false,
            },
            {
                day: 'Thursday',
                valueStart: 540,
                errorStart: false,
                valueEnd: 1080,
                errorEnd: false,
                disable: false,
            },
            {
                day: 'Friday',
                valueStart: 540,
                errorStart: false,
                valueEnd: 1080,
                errorEnd: false,
                disable: false,
            },
            {
                day: 'Saturday',
                valueStart: 540,
                errorStart: false,
                valueEnd: 1080,
                errorEnd: false,
                disable: true,
            },
            {
                day: 'Sunday',
                valueStart: 540,
                errorStart: false,
                valueEnd: 1080,
                errorEnd: false,
                disable: true,
            },
        ]);

        const widgetSettingDataSync = computed({
            get(): any {
                return props.widgetSettingData;
            },
            set(value: any) {
                emit('update:widgetSettingData', value);
            },
        });

        const applyValueReplyTime = () => {
            if (valueReplyTime.value) {
                showListReplyTime.value = false;
                switch (valueReplyTime.value) {
                    case 'In a few minutes':
                        selectReplyTime.value = 'Typically reply in a few minutes';
                        break;
                    case 'In a few hours':
                        selectReplyTime.value = 'Typically reply in a few hours';
                        break;
                    case 'In a few day':
                        selectReplyTime.value = 'Typically reply in a day';
                        break;
                    default:
                        selectReplyTime.value = 'Other';
                        break;
                }
                // valueReplyTimeClone.value = valueReplyTime.value.slice();
                // disabledApply.value = false;
                if (selectReplyTime.value == 'Other') {
                    widgetSettingDataSync.value.reply_time = otherReplyTime.value;
                } else {
                    widgetSettingDataSync.value.reply_time = valueReplyTime.value;
                }
            }
        };

        const changeOfficeHours = (val: any) => {
            const sameValue = defaultOfficeHours.value.filter((element: any) => {
                return val.includes(element.day);
            });
            const unsameValue = defaultOfficeHours.value.filter((element: any) => {
                return !val.includes(element.day);
            });

            const arrayDefault = defaultOfficeHours.value;
            for (const i in arrayDefault) {
                for (const y in sameValue) {
                    if (sameValue[y] == arrayDefault[i]) {
                        arrayDefault[i].disable = false;
                        break;
                    }
                }
                for (const y in unsameValue) {
                    if (unsameValue[y] == arrayDefault[i]) {
                        arrayDefault[i].disable = true;
                        break;
                    }
                }
            }

            if (unsameValue.length > 0) {
                const objIndexStart = unsameValue.findIndex((obj: any) => obj.errorStart == true);
                const objIndexEnd = unsameValue.findIndex((obj: any) => obj.errorEnd == true);
                if (objIndexStart !== -1) {
                    unsameValue[objIndexStart].valueStart = 540;
                    unsameValue[objIndexStart].errorStart = false;
                }
                if (objIndexEnd !== -1) {
                    unsameValue[objIndexEnd].valueEnd = 1080;
                    unsameValue[objIndexEnd].errorEnd = false;
                }
            }
        };

        const onCallTimezoneBySearch = async (val: any) => {
            if (!val.push) {
                listTimezone.value = [];
                nextPage.value = 1;
                const data = await getTimezone({ key_word: val.text, skip: nextPage.value, limit: 20 });
                if (!data.error) {
                    nextPage.value++;
                    totalPageTimezone.value = data.totalPage;
                    listTimezone.value = [...listTimezone.value, ...data.data];
                }
            } else {
                if (nextPage.value > totalPageTimezone.value) return;
                const data = await getTimezone({ key_word: val.text, skip: nextPage.value, limit: 20 });
                if (!data.error) {
                    nextPage.value++;
                    listTimezone.value = [...listTimezone.value, ...data.data];
                }
            }
        };

        const getValueReplyTime = () => {
            if (widgetSettingDataSync.value.reply_time) {
                switch (widgetSettingDataSync.value.reply_time) {
                    case 'In a few minutes':
                        selectReplyTime.value = 'Typically reply in a few minutes';
                        break;
                    case 'In a few hours':
                        selectReplyTime.value = 'Typically reply in a few hours';
                        break;
                    case 'In a few day':
                        selectReplyTime.value = 'Typically reply in a day';
                        break;
                    default:
                        selectReplyTime.value = 'Other';
                        break;
                }
                if (selectReplyTime.value == 'Other') {
                    valueReplyTime.value = 'Other';
                    otherReplyTime.value = widgetSettingDataSync.value.reply_time;
                } else {
                    valueReplyTime.value = widgetSettingDataSync.value.reply_time;
                }
            } else {
                selectReplyTime.value = 'Typically reply in a few minutes';
            }
        };

        const convertArrGetHour = () => {
            const arrCustomHour = widgetSettingDataSync.value.office_hour.map((e: any) => {
                return e.day;
            });
            selectedOfficeHours.value = arrCustomHour;
            const sameValue = defaultOfficeHours.value.filter((element: any) => {
                return arrCustomHour.includes(element.day);
            });
            const unsameValue = defaultOfficeHours.value.filter((element: any) => {
                return !arrCustomHour.includes(element.day);
            });
            console.log('sameValue', sameValue);

            const arrayDefault = widgetSettingDataSync.value.office_hour;
            let arrayOfficeHours = defaultOfficeHours.value;
            // for (const i in arrayDefault) {
            //     for (const y in sameValue) {
            //         if (sameValue[y].day == arrayDefault[i].day) {
            //             arrayOfficeHours[i].valueStart = arrayDefault[i].range[0];
            //             arrayOfficeHours[i].valueEnd = arrayDefault[i].range[1];
            //             arrayOfficeHours[i].disable = false;
            //             if (props.discardData) {
            //                 arrayOfficeHours[i].errorStart = false;
            //                 arrayOfficeHours[i].errorEnd = false;
            //             }
            //             break;
            //         }
            //     }
            //     for (const y in unsameValue) {
            //         unsameValue[y].disable = true;
            //     }
            // }
            arrayOfficeHours = arrayOfficeHours.map((e: any) => {
                for (const y in sameValue) {
                    if (sameValue[y].day == e.day) {
                        e.valueStart = arrayDefault[y].range[0];
                        e.valueEnd = arrayDefault[y].range[1];
                        e.disable = false;
                        if (props.discardData) {
                            e.errorStart = false;
                            e.errorEnd = false;
                        }
                        break;
                    }
                }
                for (const y in unsameValue) {
                    unsameValue[y].disable = true;
                }
            })
            // console.log('arrayOfficeHours', arrayOfficeHours);
        };

        const getSelectOfficeHour = () => {
            if (widgetSettingDataSync.value.office_hour == null) officeHours.value = '';
            else if (widgetSettingDataSync.value.office_hour.length == 0) officeHours.value = '247';
            else {
                officeHours.value = 'custom';
                convertArrGetHour();
            }
        };

        const onChangeTimeStart = (value: any) => {
            if (value.valueStart == value.valueEnd) {
                value.errorStart = true;
                emit('disableSave', true);
            } else if (value.valueStart > value.valueEnd) {
                value.errorStart = true;
                emit('disableSave', true);
            } else {
                value.errorStart = false;
                value.errorEnd = false;
                emit('disableSave', false);
            }
        };

        const onChangeTimeEnd = (value: any) => {
            if (value.valueStart == value.valueEnd) {
                value.errorEnd = true;
                emit('disableSave', true);
            } else if (value.valueStart > value.valueEnd) {
                value.errorEnd = true;
                emit('disableSave', true);
            } else {
                value.errorEnd = false;
                value.errorStart = false;
                emit('disableSave', false);
            }
        };

        const onChangeTimezone = (val: any) => {
            widgetSettingDataSync.value.timezone_label = val[0].children;
        };

        const resetHour = () => {
            selectedOfficeHours.value = JSON.parse(JSON.stringify(selectedOfficeHoursClone.value));
            defaultOfficeHours.value = JSON.parse(JSON.stringify(defaultOfficeHoursClone.value));
        };

        const convertArrPushHour = () => {
            const arrCustomHour = defaultOfficeHours.value.filter((e: any) => {
                for (const i in selectedOfficeHours.value) {
                    if (e.day == selectedOfficeHours.value[i]) return e;
                }
            });
            const result = arrCustomHour.map(
                ({ day, valueStart, valueEnd }: { day: string; valueStart: number; valueEnd: number }) => ({
                    day,
                    range: [valueStart, valueEnd],
                }),
            );
            widgetSettingDataSync.value.office_hour = JSON.parse(JSON.stringify(result));
            return result;
        };

        const onChangeOfficeHours = (val: any) => {
            if (val == '247') widgetSettingDataSync.value.office_hour = [];
            else {
                convertArrPushHour();
            }
        };
        const checkErrorOtherReplyTime = ref<boolean>(false);

        const clickOutsideContent = () => {
            const selectReply = ['In a few minutes', 'In a few hours', 'In a few day'];
            if (widgetSettingDataSync.value.reply_time == null) {
                valueReplyTime.value = 'In a few minutes';
            } else if (widgetSettingDataSync.value.reply_time !== valueReplyTime.value) {
                if (selectReply.includes(widgetSettingDataSync.value.reply_time)) {
                    valueReplyTime.value = widgetSettingDataSync.value.reply_time;
                } else {
                    valueReplyTime.value = 'Other';
                    otherReplyTime.value = widgetSettingDataSync.value.reply_time;
                }
            }
        };

        const formatTimezone = (val: any) => {
            return val.replaceAll('_', ' ');
        };

        // const checkErrorOtherReplyTime = computed(() => {
        //     if (!showListReplyTime.value && valueReplyTime.value == 'Other' && otherReplyTime.value == '') return true;
        //     else if (!showListReplyTime.value && valueReplyTime.value !== 'Other' && disabledApply.value) {
        //         applyValueReplyTime();
        //         return false;
        //     } else return false;
        // });

        watch(
            () => valueReplyTime.value,
            (newVal: string) => {
                console.log(newVal);
                if (newVal == 'Other') {
                    if (otherReplyTime.value) disabledApply.value = false;
                    else {
                        disabledApply.value = true;
                        window.setTimeout(() => {
                            replyTime.value.textfieldComp.focus();
                        }, 1);
                    }
                } else {
                    disabledApply.value = false;
                }
            },
            { deep: true },
        );

        watch(
            () => otherReplyTime.value,
            () => {
                if (otherReplyTime.value) {
                    checkErrorOtherReplyTime.value = false;
                    disabledApply.value = false;
                } else {
                    console.log('otherReplyTime1');
                    checkErrorOtherReplyTime.value = true;
                    disabledApply.value = true;
                }
            },
        );

        onMounted(async () => {
            await onCallTimezoneBySearch({ text: '', push: false });
            getValueReplyTime();
            getSelectOfficeHour();
        });

        watch(
            () => defaultOfficeHours.value,
            () => {
                showBtnResetHour.value =
                    JSON.stringify(defaultOfficeHours.value) !== JSON.stringify(defaultOfficeHoursClone.value);
                convertArrPushHour();
            },
            { deep: true },
        );

        watch(
            () => props.discardData,
            (newVal: boolean) => {
                if (newVal) {
                    getValueReplyTime();
                    getSelectOfficeHour();
                    emit('update:discardData', false);
                }
            },
            { deep: true },
        );

        return {
            showListReplyTime,
            officeHours,
            selectedOfficeHours,
            widgetSettingDataSync,
            valueReplyTime,
            otherReplyTime,
            selectReplyTime,
            defaultOfficeHours,
            timePicker,
            changeOfficeHours,
            onCallTimezoneBySearch,
            nextPage,
            listTimezone,
            totalPageTimezone,
            applyValueReplyTime,
            disabledApply,
            // valueReplyTimeClone,
            replyTime,
            onChangeTimeStart,
            onChangeTimeEnd,
            defaultOfficeHoursClone,
            showBtnResetHour,
            resetHour,
            selectedOfficeHoursClone,
            onChangeTimezone,
            checkErrorOtherReplyTime,
            onChangeOfficeHours,
            clickOutsideContent,
            formatTimezone,
        };
    },
};
</script>

<style lang="scss" scoped>
.radio-custom-hour {
    :deep(.radio-group) {
        width: 100%;
    }
}
.btn-reply-time {
    width: 328px;
    &.ring-error {
        box-shadow: 0 0 0 2px #ffe5e5;
    }
}
.list-reply-time {
    :deep(.list-component--custom) {
        display: block;
    }
}
:deep(.workspace-timezone) {
    width: 328px;
}
:deep(.select__button-hours) {
    width: 145px;
}
</style>
