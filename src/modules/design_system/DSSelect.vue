<template>
    <div class="p-12p">
        <div class="grid grid-flow-col grid-cols-4 mb-16p">
            <div></div>
            <div class="type">
                <label for="type" class="block text-sm font-semibold text-gray-700 mb-4p text-center">Type</label>
                <select
                    v-model="type"
                    id="type"
                    name="type"
                    class="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option :value="'default'">Default</option>
                    <option :value="'disable'">Disable</option>
                    <option :value="'error'">Error</option>
                </select>
            </div>
            <div class="error-text">
                <label for="error" class="block text-sm font-semibold text-gray-700 mb-4p text-center"
                    >Show Error</label
                >
                <select
                    v-model="isError"
                    id="error"
                    name="error"
                    class="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option :value="true">True</option>
                    <option :value="false">False</option>
                </select>
            </div>
            <div></div>
        </div>
        <div class="grid grid-flow-col grid-cols-3">
            <div class="border-r-2 p-12p text-center">
                <label class="block text-md font-semibold text-gray-700 mb-4p">No Icon {{ valueSelect }}</label>
                <Select
                    :error="type == 'error'"
                    :disabled="type == 'disable'"
                    v-model="valueSelect"
                    showSearch
                    maxHeightList="260px"
                    :errorText="isError ? 'This is error message' : ''"
                >
                    <SelectPanel v-for="(index, i) in optionSelect" :key="i" :value="index.id">
                        {{ index.name }}
                    </SelectPanel>
                </Select>
            </div>
            <div class="border-r-2 p-12p text-center">
                <label class="block text-md font-semibold text-gray-700 mb-4p">Icondqwdqwd</label>
                <Select
                    :error="type == 'error'"
                    :disabled="type == 'disable'"
                    v-model="valueSelectIcon"
                    showSearch
                    selectedIconLabel="globe"
                    :errorText="isError ? 'This is error message' : ''"
                >
                    <SelectPanel
                        v-for="(index, i) in optionSelectIcon"
                        :key="i"
                        :value="index.value"
                        :disabled="index.disabled"
                    >
                        <template #icon>
                            <icon-component class="arrow" :color="index.disabled ? 'neutrals-300' : 'neutrals-900'" :name="index.icon" />
                        </template>
                        {{ index.label }}
                    </SelectPanel>
                </Select>
            </div>
            <div class="p-12p text-center">
                <label class="block text-md font-semibold text-gray-700 mb-4p">Custom label</label>
                <SelectCustom
                    :error="type == 'error'"
                    :disabled="type == 'disable'"
                    v-model="valueSelectTest"
                    showSearch
                    :errorText="isError ? 'This is error message' : ''"
                    styleSelect="tick"
                >
                    <template v-slot:label>
                        <avatar-component
                            :label-show="false"
                            size="medium"
                            :label-avatar="selectedValue"
                            class-component="mr-4"
                            :bgAvatar="'bg-avatar-2'"
                        />
                    </template>
                    <SelectPanel v-for="(index, i) in optionSelect1" :key="i" :value="index.value">
                        {{ index.label }}
                    </SelectPanel>
                </SelectCustom>
            </div>
        </div>
        <div class="mt-16p">
            <label for="type" class="block text-16 text-gray-700 mb-4p text-center">Multiple</label>
            <div class="grid grid-flow-col grid-cols-2">
                <div class="p-12p border-r-2 text-center">
                    <label class="block text-md font-semibold text-gray-700 mb-4p">No Icon</label>
                    <select-multi
                        :error="type == 'error'"
                        :disabled="type == 'disable'"
                        :options="optionSelectMultiple"
                        v-model="valueSelectMultiple"
                        class="select"
                        :errorText="isError ? 'This is error message' : ''"
                        showSearch
                    >
                        <template #label="{ item }">{{ item.item.label }}</template>
                    </select-multi>
                </div>
                <div class="p-12p text-center">
                    <label class="block text-md font-semibold text-gray-700 mb-4p">Icon</label>
                    <select-multi
                        :error="type == 'error'"
                        :disabled="type == 'disable'"
                        :options="optionSelectMultiple"
                        v-model="valueSelectMultiple"
                        selectedIconLabel="globe"
                        class="select"
                        :errorText="isError ? 'This is error message' : ''"
                        @change="changeValue"
                        showSearch
                    >
                        <template #label="{ item }">{{ item.item.label }}</template>
                    </select-multi>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive } from 'vue';
import SelectMulti from '@/components/ui/SelectMultipleComponent.vue';
import Select from '@/components/ui/SelectComponent.vue';
import SelectPanel from '@/components/ui/SelectPanel.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import SelectCustom from '@/components/ui/SelectCustom.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';

interface Inter {
    label: string;
    value: string;
    icon: string;
    disabled: boolean;
}
export default defineComponent({
    name: 'Select Component',
    components: {
        Select,
        SelectMulti,
        SelectPanel,
        IconComponent,
        SelectCustom,
        AvatarComponent,
    },
    data() {
        return {
            valueSelect: '1',
            valueSelectIcon: '',
            // valueSelectTest: '12',
            valueSelectMultiple: ['12', '22'],
            optionSelect: [
                { name: 'Hintonburg', id: '1' },
                { name: 'Westboro', id: '2' },
                { name: 'Downtown', id: '3' },
                { name: 'Richmond Hill', id: '4' },
                { name: 'Hintonburg', id: '5' },
                { name: 'Westboro', id: '6' },
                { name: 'Downtown', id: '7' },
                { name: 'Richmond Hill', id: '8' },
                { name: 'Richmond Hill', id: '9' },
                { name: 'Richmond Hill', id: '10' },
            ],
            optionSelectIcon: [
                { label: 'Hintonburg', value: '12', icon: 'globe', disabled: true },
                { label: 'Westboro', value: '22', icon: 'Folders', disabled: false },
                { label: 'Downtown', value: '32', icon: 'globe' },
            ],
            optionSelectMultiple: [
                { label: 'Hintonburg', value: '12' },
                { label: 'Westboro', value: '22' },
                { label: 'Downtown', value: '32' },
                { label: 'Richmond Hill', value: '123' },
            ],
            type: 'default',
            isError: false,
            imageAssign: '',
        };
    },
    setup() {
        const valueSelectTest = ref<any>('12');
        const optionSelect1 = reactive<object[]>([
            { label: 'Hintonburg', value: '12' },
            { label: 'Westboro', value: '22' },
            { label: 'Downtown', value: '32' },
            { label: 'Richmond Hill', value: '123' },
        ]);

        const selectedValue = computed(() => {
            if (valueSelectTest.value) {
                const value = (optionSelect1 as any).filter((value: any) => {
                    return value.value == valueSelectTest.value;
                });
                return value[0].label;
            } else return '';
        });

        return {
            selectedValue,
            optionSelect1,
            valueSelectTest,
        };
    },
    methods: {
        changeValue(e: Inter) {
            console.log(e);
            // this.valueSelectIcon = e.label;
            // (this.valueSelectMultiple as any).value = e
        },
    },
});
</script>

<style scoped lang="scss">
select {
    margin: 0 auto;
}
.custom-select-component,
.custom-select-multiple-component {
    max-width: 200px;
}
</style>
