<template>
    <select-comp ref="selectComp" v-if="dropdown">
        <template #title>
            <icon-comp name="calendar" class="mr-8p"></icon-comp>
            <span class="flex-grow text-left" :class="status === 'init'">
                {{ status === 'init' && placeholder ? placeholder : dateFormat }}
            </span>
            <icon-comp v-if="status === 'init'" name="angle-down"></icon-comp>
            <icon-comp v-else class="cursor-pointer" name="times" @click="onClearTime"></icon-comp>
        </template>
        <div class="flex cursor-auto">
            <template v-if="type === 'custom'">
                <ul class="pt-8p px-8p border-r">
                    <li
                        class="text-14 px-12p py-8p w-148 mb-4p cursor-pointer hover:bg-primary-50 rounded-4p"
                        :class="[item.value === valueCustomActive ? 'bg-primary-50' : '']"
                        v-for="item in optionDatas"
                        :key="item.value"
                        @click="onActiveCustomOption(item.value)"
                    >
                        {{ item.name }}
                    </li>
                </ul>
                <div>
                    <div class="flex px-16p pt-16p pb-12p border-0 border-b">
                        <span class="flex mr-24p text-14">
                            <h3 class="mr-8p font-medium text-neutrals-300">From</h3>
                            <h3 v-if="tempDate">{{ format(tempDate.start, 'MMM dd, yyyy') }}</h3>
                            <h3 v-else class="text-neutrals-300">{{ format(new Date(), 'MMM dd, yyyy') }}</h3>
                        </span>
                        <span class="flex text-14">
                            <h3 class="mr-8p font-medium text-neutrals-300">To</h3>
                            <h3 v-if="tempDate">{{ format(tempDate.end, 'MMM dd, yyyy') }}</h3>
                            <h3 v-else class="text-neutrals-300">{{ format(new Date(), 'MMM dd, yyyy') }}</h3>
                        </span>
                    </div>
                    <!-- <div class="mx-16p mt-12p mb-16p"> -->
                    <div>
                        <DatePickerComp
                            :to-page="fromPage"
                            class="date-picker date-picker--have-button"
                            is-range
                            v-model="tempDate"
                            :columns="columns"
                            @dayclick="onDayClick"
                        ></DatePickerComp>

                        <div class="w-full flex justify-end py-6p pb-16p px-16p">
                            <button-comp @click="onCancel" type="secondary" class="mr-8p">Cancel</button-comp>
                            <button-comp :disabled="!tempDate" @click="onApply">Apply</button-comp>
                        </div>
                    </div>
                </div>
            </template>

            <template v-else>
                <!-- <div class="mx-16p mt-12p mb-16p"> -->
                <div>
                    <DatePickerComp
                        :to-page="fromPage"
                        class="date-picker date-picker--have-button"
                        :is-range="type !== 'single'"
                        v-model="tempDate"
                        :columns="columns"
                        @dayclick="onDayClick"
                    ></DatePickerComp>

                    <div v-if="type !== 'single'" class="w-full flex justify-end py-6p pb-16p px-16p">
                        <button-comp @click="onCancel" type="secondary" class="mr-8p">Cancel</button-comp>
                        <button-comp :disabled="!tempDate" @click="onApply">Apply</button-comp>
                    </div>
                </div>
            </template>
        </div>
    </select-comp>
    <DatePickerComp
        v-else
        class="date-picker"
        v-model="tempDate"
        :is-range="type === 'range'"
        :columns="columns"
    ></DatePickerComp>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { format } from 'date-fns';
import DatePickerComp from './DatePicker/DatePicker.vue';
import SelectComp from '@/components/ui/DatePickerComponent/SelectDatepickerComponent.vue';
import IconComp from '@/components/ui/IconComponent.vue';
import ButtonComp from '@/components/ui/ButtonComponent.vue';
const calculateOptionsDate = () => {
    const getSubDate = (value: any) => {
        let date = null;
        if (typeof value === 'number') {
            date = new Date(new Date().setDate(new Date().getDate() - value));
            return { start: date, end: value !== 1 ? new Date() : date };
        }
        if (value === 'tmonth') {
            date = new Date();
            return {
                start: new Date(date.getFullYear(), date.getMonth(), 1),
                end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
            };
        }
        if (value === 'lmonth') {
            date = new Date();
            return {
                start: new Date(date.getFullYear(), date.getMonth() - 1, 1),
                end: new Date(date.getFullYear(), date.getMonth(), 0),
            };
        }
    };

    const optionDatas = [
        {
            name: 'Today',
            value: 'today',
            data: { start: new Date(), end: new Date() },
        },
        {
            name: 'Yesterday',
            value: 'yesterday',
            data: getSubDate(1),
        },
        {
            name: 'Last 7 days',
            value: 'last7',
            data: getSubDate(6),
        },
        {
            name: 'Last 30 days',
            value: 'last30',
            data: getSubDate(29),
        },
        {
            name: 'This month',
            value: 'tmonth',
            data: getSubDate('tmonth'),
        },
        {
            name: 'Last month',
            value: 'lmonth',
            data: getSubDate('lmonth'),
        },
        {
            name: 'Custom range',
            value: 'custom',
        },
    ];
    return optionDatas;
};

export default defineComponent({
    name: 'DatePicker',
    components: {
        DatePickerComp,
        SelectComp,
        IconComp,
        ButtonComp,
    },
    props: {
        type: {
            type: String,
            default: 'range',
        },
        placeholder: {
            type: String,
            default: 'date',
        },
        dropdown: {
            type: Boolean,
            default: false,
        },
        defaultValue: {
            default: null,
        },
        columns: {
            default: 1,
        },
    },
    emits: ['update:modelValue', 'onChange'],
    methods: {
        onCloseDropDown() {
            const _this: any = this;
            _this.$refs.selectComp.closeOption();
            this.date = this.tempDate;
        },
        onDayClick() {
            if (this.type === 'single') {
                this.onCloseDropDown();
            }
        },
        onApply() {
            this.date = this.tempDate;
            this.status = 'modified';
            this.$emit('onChange', this.date);
            this.onCloseDropDown();
        },
        onCancel() {
            this.valueCustomActive = null;
            this.tempDate = this.date;
            this.onCloseDropDown();
            console.log('On cancel');
        },
        onActiveCustomOption(value: any) {
            this.valueCustomActive = value;
            if (value !== 'custom') this.tempDate = this.optionDatas.find((item: any) => item.value === value)!.data;
            if (value === 'custom') this.tempDate = null;
            // this.fromPage = { month: format(this.tempDate.start, 'M'), year: format(this.tempDate.start, 'Y') };
            // console.log({ month: format(this.tempDate.start, 'M'), year: format(this.tempDate.start, 'Y') });
        },
        async onClearTime() {
            this.tempDate =
                this.type === 'single'
                    ? new Date()
                    : {
                          start: new Date(),
                          end: new Date(),
                      };
            await new Promise(resolve => setTimeout(resolve, 100));
            this.onCloseDropDown();
            this.status = 'init';
            this.$emit('onChange', null);
        },
    },
    computed: {
        dateFormat(): string {
            if (this.type !== 'single') {
                return `${format(this.date.start, 'MMM dd, yyyy')} - ${format(this.date.end, 'MMM dd, yyyy')}`;
            } else {
                return this.type === 'single'
                    ? format(this.date, 'MMM dd, yyyy')
                    : `${format(this.date.start, 'MMM dd, yyyy')} - ${format(this.date.end, 'MMM dd, yyyy')}`;
            }
        },
    },
    setup(props) {
        const status = ref('init');

        const fromPage: any = ref(null);

        const valueCustomActive: any = ref(null);

        const optionDatas = calculateOptionsDate();

        const tempDate: any = ref(
            props.type === 'single'
                ? new Date()
                : {
                      start: new Date(),
                      end: new Date(),
                  },
        );

        const currentDate = new Date();

        const date: any = ref(tempDate.value);

        onMounted(() => {
            const { defaultValue } = props;
            if (defaultValue !== null) {
                date.value = defaultValue;
            }
        });

        return {
            fromPage,
            date,
            currentDate,
            format,
            tempDate,
            optionDatas,
            valueCustomActive,
            status,
        };
    },
    watch: {
        tempDate: {
            handler(value) {
                if (this.type === 'single') {
                    this.$emit('onChange', value);
                    this.$emit('update:modelValue', value);
                }
                if (this.type === 'range' && !this.dropdown) {
                    this.$emit('onChange', value);
                    if (value.start && value.end) this.$emit('update:modelValue', value);
                }
                // this.status = 'modified';
            },
        },
        type: {
            handler() {
                this.tempDate =
                    this.type === 'single'
                        ? new Date()
                        : {
                              start: new Date(),
                              end: new Date(),
                          };
            },
        },
    },
});
</script>

<style lang="scss">
.date-picker--have-button {
    .vc-pane {
        padding-bottom: 0;
    }
}
</style>
