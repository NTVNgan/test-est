<template>
    <div>
        <h4 class="mb-4p text-center">Single Checkbox</h4>
        <div class="ds-checkbox grid grid-flow-col grid-cols-2 mb-16p">
            <div class="border-r-2">
                <CheckBox
                    v-model="valueSingle"
                    :nameSingleCheckbox="'singlecheck'"
                    :valueSingleCheckbox="'bike'"
                >
                    <template v-slot:label>i have a bike</template>
                </CheckBox>
                <CheckBox :nameSingleCheckbox="'singlecheck'" :valueSingleCheckbox="'bike'" checked>
                    <template v-slot:label>i have a bike</template>
                </CheckBox>
                <CheckBoxCustom value="11" name="111" v-model="selectedCategories1">
                    <template #title>11</template>
                    <template v-slot:label>i have a bike</template>
                </CheckBoxCustom>
                <CheckBoxCustom value="21" name="111" v-model="selectedCategories1">
                    <template v-slot:label>i have a bike</template>
                </CheckBoxCustom>
                 <CheckBoxCustom name="222" v-model="selectedCategories2" disabled>
                    <template v-slot:label>{{selectedCategories2}}</template>
                </CheckBoxCustom>
                <CheckBoxCustom value="21" name="test" checked disabled>
                    <template v-slot:label>i have a bike</template>
                </CheckBoxCustom>
            </div>
            <div>
                <label
                    for="type"
                    class="text-center block text-sm font-bold text-gray-700 mb-12p"
                >Disable</label>
                <CheckBox
                    checked
                    :nameSingleCheckbox="'singlecheck1'"
                    :valueSingleCheckbox="'bike'"
                    disabledSingleCheckbox
                >
                    <template v-slot:label>i have a bike</template>
                </CheckBox>
                <CheckBox
                    v-model="valueSingle2"
                    :nameSingleCheckbox="'singlecheck2'"
                    :valueSingleCheckbox="'bike2'"
                    disabledSingleCheckbox
                >
                    <template v-slot:label>i have a bike</template>
                </CheckBox>
            </div>
        </div>

        <h4 class="mt-12p mb-4p text-center">Group Checkbox</h4>
        <CheckBox
            class="ds-checkbox"
            v-model="valueGroup"
            :typeCheckbox="'group'"
            :nameGroupCheckbox="'checkbox'"
            :optionGroupCheckbox="optionCheckbox"
        >
            <template #label="{item}">
                {{item.label}}
            </template>
        </CheckBox>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CheckBox from '@/components/ui/CheckboxComponent.vue';
import CheckBoxCustom from '@/components/ui/CheckboxCustom.vue';

export default defineComponent({
    name: 'Checkbox',
    components: { CheckBox, CheckBoxCustom },
    data() {
        return {
            valueSingle: false,
            valueSingle1: true,
            valueSingle2: false,
            optionCheckbox: [
                { label: '1', value: '11' },
                { label: '2', value: '22' },
                { label: '3', value: '33' },
            ],
            valueGroup: ['11'],
            checked: false,
            cities: [],
            categories: [
                { name: 'Accounting', key: 'A' },
                { name: 'Marketing', key: 'M' },
                { name: 'Production', key: 'P' },
                { name: 'Research', key: 'R' },
            ],
            selectedCategories: [],
            selectedCategories1: ['11'],
            selectedCategories2: false
        };
    },
    methods: {},
    created() {
        (this.selectedCategories as any) = this.categories.slice(1, 3);
    },
});
</script>

<style lang="scss">

</style>
