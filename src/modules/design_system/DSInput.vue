<template>
    <div>
        <Input
            class="w-300"
            :label="label == 'true' ? 'Label' : ''"
            v-model="text"
            :state="state"
            :counter="counter === 'true'"
            :maxlength="counter ? counterText : undefined"
            :type="type"
            :disabled="state === 'disabled'"
            :closeIcon="closeIcon === 'true'"
            placeholder="name@example.com"
            :stepper="stepper === 'true'"
        >
            <template v-slot:prefix v-if="prefix == 'true'">
                <icon name="search"></icon>
                {{ prefixText }}
            </template>
            <template v-slot:suffix v-if="suffix == 'true'">
                {{ suffixText }}
            </template>
            <template v-slot:hint v-if="hint == 'true'">
                hint slot
            </template>
        </Input>
        <div class="mt-5 flex space arround flex-wrap">
            <div class="mx-4">
                <label for="label" class="block text-sm font-medium text-gray-700">Label</label>
                <select
                    v-model="label"
                    id="label"
                    name="label"
                    class="
                        mt-1
                        block
                        w-full
                        pl-3
                        pr-10
                        py-2
                        text-base
                        border-gray-300
                        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                        sm:text-sm
                        rounded-md
                    "
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
                    class="
                        mt-1
                        block
                        w-full
                        pl-3
                        pr-10
                        py-2
                        text-base
                        border-gray-300
                        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                        sm:text-sm
                        rounded-md
                    "
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
                    class="
                        mt-1
                        block
                        w-full
                        pl-3
                        pr-10
                        py-2
                        text-base
                        border-gray-300
                        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                        sm:text-sm
                        rounded-md
                    "
                >
                    <option>default</option>
                    <option>error</option>
                    <option>disabled</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="label" class="block text-sm font-medium text-gray-700">Type</label>
                <select
                    v-model="type"
                    id="state"
                    name="state"
                    class="
                        mt-1
                        block
                        w-full
                        pl-3
                        pr-10
                        py-2
                        text-base
                        border-gray-300
                        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                        sm:text-sm
                        rounded-md
                    "
                >
                    <option>text</option>
                    <option>number</option>
                    <option>password</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="label" class="block text-sm font-medium text-gray-700">Close Icon</label>
                <select
                    v-model="closeIcon"
                    id="state"
                    name="state"
                    class="
                        mt-1
                        block
                        w-full
                        pl-3
                        pr-10
                        py-2
                        text-base
                        border-gray-300
                        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                        sm:text-sm
                        rounded-md
                    "
                >
                    <option>true</option>
                    <option>false</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="label" class="block text-sm font-medium text-gray-700">Stepper</label>
                <select
                    v-model="stepper"
                    id="state"
                    name="state"
                    class="
                        mt-1
                        block
                        w-full
                        pl-3
                        pr-10
                        py-2
                        text-base
                        border-gray-300
                        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                        sm:text-sm
                        rounded-md
                    "
                >
                    <option>true</option>
                    <option>false</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="label" class="block text-sm font-medium text-gray-700">Counter</label>
                <select
                    v-model="counter"
                    id="state"
                    name="state"
                    class="
                        mt-1
                        block
                        w-full
                        pl-3
                        pr-10
                        py-2
                        text-base
                        border-gray-300
                        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                        sm:text-sm
                        rounded-md
                    "
                >
                    <option>true</option>
                    <option>false</option>
                </select>
                <Input class="w-10p mt-3" v-if="counter === 'true'" stepper type="number" v-model="counterText" />
            </div>
            <div class="mx-4">
                <label for="label" class="block text-sm font-medium text-gray-700">Prefix</label>
                <select
                    v-model="prefix"
                    id="state"
                    name="state"
                    class="
                        mt-1
                        block
                        w-full
                        pl-3
                        pr-10
                        py-2
                        text-base
                        border-gray-300
                        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                        sm:text-sm
                        rounded-md
                    "
                >
                    <option>true</option>
                    <option>false</option>
                </select>
                <Input class="w-200 mt-3" v-if="prefix === 'true'" v-model="prefixText" />
            </div>
            <div class="mx-4">
                <label for="label" class="block text-sm font-medium text-gray-700">Suffix</label>
                <select
                    v-model="suffix"
                    id="state"
                    name="state"
                    class="
                        mt-1
                        block
                        w-full
                        pl-3
                        pr-10
                        py-2
                        text-base
                        border-gray-300
                        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                        sm:text-sm
                        rounded-md
                    "
                >
                    <option>true</option>
                    <option>false</option>
                </select>
                <Input class="w-200 mt-3" v-if="suffix === 'true'" v-model="suffixText" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Input from '@/components/ui/InputComponent.vue';
import Icon from '@/components/ui/IconComponent.vue';
export default defineComponent({
    name: 'InputComp',
    components: {
        Input,
        Icon,
    },
    data() {
        return {
            text: '',
            label: false,
            hint: false,
            optional: false,
            state: 'default',
            type: 'text',
            prefix: 'false',
            prefixText: '',
            suffix: 'false',
            suffixText: '',
            counter: 'false',
            counterText: 0,
            closeIcon: 'false',
            stepper: 'false',
        };
    },
});
</script>
