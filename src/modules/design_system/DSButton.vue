<template>
    <div class="ds-button flex justify-around items-center pb-5">
        <div class="flex mt-5  ">
            <div class="mx-4">
                <label for="size" class="block text-sm font-medium text-gray-700">Size</label>
                <select
                    v-model="size"
                    id="size"
                    name="size"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>small</option>
                    <option selected>medium</option>
                    <option>large</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
                <select
                    v-model="type"
                    id="type"
                    name="type"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>primary</option>
                    <option>subtle</option>
                    <option>secondary</option>
                    <option>outline</option>
                    <option>link</option>
                    <option>destructive</option>
                    <option>destructive-link</option>
                    <option>destructive-sublte</option>
                    <option>count</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="Disable" class="block text-sm font-medium text-gray-700">Disable</label>
                <select
                    v-model="disabled"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>true</option>
                    <option>false</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="Icon" class="block text-sm font-medium text-gray-700">Icon</label>
                <select
                    v-model="icon"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>left</option>
                    <option>right</option>
                    <option>none</option>
                </select>
            </div>
        </div>
        <div>
            <button-component
                :count="1"
                :icon="icon !== 'none' ? 'chevronDown' : ''"
                :disabled="disabled === 'true'"
                :size="size"
                :type="type"
                :positionIcon="icon !== 'none' ? icon : ''"
            >
                <span>
                    Label
                </span>
            </button-component>
        </div>
        <button-component :size="size" :type="type" icon="person" :disabled="disabled === 'true'" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
export default defineComponent({
    data() {
        return {
            icon: 'none',
            disabled: 'false',
            size: 'medium',
            type: 'primary',
        };
    },
    components: {
        ButtonComponent,
    },
});
</script>
