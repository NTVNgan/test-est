<template>
    <div>
        <div class="flex mt-5 mb-10">
            <div class="mx-4">
                <label for="size" class="block text-sm font-medium text-gray-700">Align</label>
                <select
                    v-model="align"
                    id="size"
                    name="size"
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
                    <option>vertical</option>
                    <option>horizontal</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="size" class="block text-sm font-medium text-gray-700">Type</label>
                <select
                    v-model="type"
                    id="size"
                    name="size"
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
                    <option>number</option>
                    <option>icon</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="size" class="block text-sm font-medium text-gray-700">Current step</label>
                <select
                    v-model="currentStep"
                    id="size"
                    name="size"
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
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            </div>
        </div>
        <div class="">
            <step
                :class="align !== 'horizontal' && `h-600`"
                :steps="steps"
                :align="align"
                :type="type"
                :currentStepIndex="Number(currentStep)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Step from '@/components/ui/StepComponent.vue';
const steps = [
    { name: 'Step 1', label: 'Label task', icon: 'person' },
    { name: 'Step 2', label: 'Label task', icon: 'person' },
    { name: 'Step 3', label: 'Label task', icon: 'Pen' },
    { name: 'Step 4', label: 'Label task', icon: 'bell' },
    { name: 'Step 5', label: 'Label task', icon: 'bell' },
];
export default defineComponent({
    name: 'StepComponent',
    components: {
        Step,
    },
    setup() {
        const align = ref('horizontal');
        const type = ref('number');
        const currentStep = ref(2);
        return {
            steps,
            align,
            type,
            currentStep,
        };
    },
});
</script>
