<template>
    <div>
        <div class="flex mt-5  mb-10">
            <div class="mx-4">
                <label for="size" class="block text-sm font-medium text-gray-700">Fitted</label>
                <select
                    v-model="fitted"
                    id="size"
                    name="size"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>true</option>
                    <option>false</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="size" class="block text-sm font-medium text-gray-700">Type</label>
                <select
                    v-model="type"
                    id="size"
                    name="size"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>underline</option>
                    <option>pill</option>
                </select>
            </div>
        </div>
        <tab-component
            v-model="tab"
            :tabs="tabs"
            default-value="company"
            @change="onChangeTab"
            :type="type"
            :fitted="fitted === 'true'"
        >   
            <div id="account">
                1111
            </div>
            <div id="company">
                2222
            </div>
        </tab-component>
    </div>
</template>

<script lang="ts">
const tabs = [
    { key: 'account', name: 'My Account' },
    { key: 'company', name: 'Company' },
    { key: 'billing', name: 'Billing' },
];

import { defineComponent } from 'vue';
import TabComponent from '@/components/ui/TabComponent.vue';
export default defineComponent({
    components: {
        TabComponent,
    },
    data() {
        return {
            type: 'underline',
            fitted: 'true',
            tabs,
            tab: 'company',
        };
    },
    methods: {
        onChangeTab(tab: any) {
            console.log('Tab change:', tab);
        },
    },
});
</script>

<style lang="scss" scoped></style>
