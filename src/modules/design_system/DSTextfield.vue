<template>
    <div class="flex justify-around">
        <div class="flex mt-5">
            <div class="mx-4">
                <label for="label" class="block text-sm font-medium text-gray-700">Label</label>
                <select
                    v-model="label"
                    id="label"
                    name="label"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>true</option>
                    <option selected>false</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="optional" class="block text-sm font-medium text-gray-700">Optional</label>
                <select
                    v-model="optional"
                    id="optional"
                    name="optional"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>true</option>
                    <option selected>false</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="label" class="block text-sm font-medium text-gray-700">Hint</label>
                <select
                    v-model="hint"
                    id="hint"
                    name="hint"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>true</option>
                    <option selected>false</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="label" class="block text-sm font-medium text-gray-700">State</label>
                <select
                    v-model="state"
                    id="state"
                    name="state"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>default</option>
                    <option selected>error</option>
                    <option>disabled</option>
                </select>
            </div>
        </div>
        <text-field
            :label="label == 'true' ? 'Label' : ''"
            v-model="text"
            :state="state"
            :disabled="state === 'disabled'"
        >
            <template v-slot:optional v-if="optional == 'true'">
                <span class="text-sm"><a class="text-primary-500 cursor-pointer	">optional</a></span>
            </template>
            <template v-slot:hint v-if="hint == 'true'">
                <span v-if="state !== 'error'" class="text-sm">This is helper text</span>
                <template v-else>
                    <span>This is error message</span>
                </template>
            </template>
        </text-field>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TextField from '@/components/ui/TextfieldComponent.vue';
export default defineComponent({
    components: {
        TextField,
    },
    data() {
        return {
            text: '',
            label: false,
            hint: false,
            optional: false,
            state: 'default',
        };
    },
});
</script>
