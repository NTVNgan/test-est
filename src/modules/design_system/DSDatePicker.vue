<template>
    <div class="flex flex-col">
        <div class="mb-10p">Value: {{ value }}</div>
        <div class="mb-10p">Single: {{ dateSingle }}</div>
        <div class="mb-10p">Range: {{ dateRange }}</div>
        <div class="flex">
            <!-- <div class="mx-4">
                <label for="dropdown" class="block text-sm font-medium text-gray-700">Dropdown</label>
                <select
                    v-model="dropdown"
                    id="dropdown"
                    name="dropdown"
                    class="
                        mt-1
                        block
                        w-full
                        pl-3
                        pr-10
                        py-2
                        text-base
                        border-gray-300
                        focus:outline-none
                        focus:ring-indigo-500
                        focus:border-indigo-500
                        sm:text-sm
                        rounded-md
                    "
                >
                    <option>true</option>
                    <option selected>false</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="size" class="block text-sm font-medium text-gray-700">Single</label>
                <date-picker type="single" :dropdown="dropdown === 'true'" :columns="1" v-model="dateSingle" />
            </div>
            <div class="mx-4">
                <label for="size" class="block text-sm font-medium text-gray-700">Range</label>
                <date-picker type="range" :dropdown="dropdown === 'true'" :columns="1" v-model="dateRange" />
            </div> -->
            <div class="mx-4">
                <label for="size" class="block text-sm font-medium text-gray-700">Custom</label>
                <date-picker type="range" :dropdown="true" :columns="2" @onChange="onChangeDate" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DatePicker from '@/components/ui/DatePickerComponent/index.vue';
export default defineComponent({
    data: function () {
        return {
            dropdown: false,
            dateSingle: new Date(),
            dateRange: {
                start: new Date(),
                end: new Date(),
            },
            value: null
        };
    },
    components: {
        DatePicker,
    },
    methods: {
        onChangeDate(value: any) {
            this.value = value;
        },
    },
});
</script>

<style lang="scss" scoped></style>
