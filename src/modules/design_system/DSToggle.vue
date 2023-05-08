<template>
    <div class="py-5 flex justify-around items-center">
        <div class="flex">
            <div class="mx-4">
                <label for="size" class="block text-sm font-medium text-gray-700">Size</label>
                <select
                    v-model="size"
                    id="size"
                    name="size"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option selected>medium</option>
                    <option>large</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="switch" class="block text-sm font-medium text-gray-700">Switch</label>
                <select
                    @change="onChangeState"
                    id="switch"
                    name="switch"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>{{ true }}</option>
                    <option selected>{{ false }}</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="disabled" class="block text-sm font-medium text-gray-700">Disabled</label>
                <select
                    v-model="disabled"
                    id="disabled"
                    name="disabled"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>true</option>
                    <option selected>false</option>
                </select>
            </div>
        </div>
        <toggle-comp v-model="state" :disabled="disabled === 'true'" :size="size"></toggle-comp>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import ToggleComp from '@/components/ui/ToggleComponent.vue';
export default defineComponent({
    name: 'DSToggle',
    data() {
        return {
            state: false,
            disabled: 'false',
            size: 'medium',
        };
    },
    methods: {
        onChangeState(event: any) {
            this.state = event.target.value == 'true';
        },
    },
    components: {
        ToggleComp,
    },
});
</script>
