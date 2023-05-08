<template>
    <div class="step-component">
        <ol class="flex flex-col justify-between text-neutrals-900" v-if="align === 'vertical'">
            <template v-for="(step, stepIdx) in stepDataDisplay" :key="step.name">
                <div
                    class="flex items-center"
                    :class="{
                        'text-neutrals-900': step.status === 'current',
                        'text-neutrals-300 ': step.status === 'upcoming',
                    }"
                >
                    <div class="step-component__dot w-28">
                        <a
                            href="#"
                            class="relative w-28 h-28 flex items-center justify-center rounded-full"
                            :class="{
                                'bg-success-6 border-none': step.status === 'complete',
                                'bg-success-3 border border-success-3 shadow-inner-white-2p': step.status === 'current',
                                'bg-white border border-1p border-neutrals-100': step.status === 'upcoming',
                            }"
                        >
                            <icon-component v-if="step.status === 'complete'" name="check" color="white" />
                            <span
                                class="text-14"
                                :class="{ 'text-white': ['current', 'complete'].includes(step.status) }"
                                v-else-if="type === 'number'"
                                >{{ stepIdx + 1 }}</span
                            >
                            <icon-component
                                v-else-if="type === 'icon'"
                                :name="step.icon"
                                :color="step.status === 'current' ? 'white' : 'neutrals-300'"
                            ></icon-component>
                            <span class="sr-only">{{ step.name }}</span>
                        </a>
                    </div>
                    <div class="ml-18p">
                        <div v-if="type === 'icon'" class="text-12 whitespace-nowrap" style="white-space: nowrap">
                            STEP {{ stepIdx + 1 }}
                        </div>
                        <div
                            class="text-14"
                            :class="{
                                'mt-8p': type === 'icon',
                                'font-normal': step.status === 'complete',
                                'font-medium text-neutrals-300': step.status === 'upcoming',
                                'font-bold': step.status === 'current',
                            }"
                            style="white-space: nowrap"
                        >
                            {{ step.label }}
                        </div>
                    </div>
                </div>
                <div
                    v-if="stepIdx !== steps.length - 1"
                    class="mt-16p mb-16p w-2 bg-neutrals-100 left-12p relative h-48 rounded-2p"
                    :class="{
                        'bg-success-6': step.status === 'complete',
                    }"
                    aria-hidden="true"
                />
            </template>
        </ol>

        <ol class="flex items-center" v-else>
            <template v-for="(step, stepIdx) in stepDataDisplay" :key="step.name">
                <div
                    class="w-32"
                    :class="{
                        'text-neutrals-900': step.status === 'current',
                        'text-neutrals-300 ': step.status === 'upcoming',
                    }"
                >
                    <span
                        class="relative w-32 h-32 flex items-center justify-center rounded-full"
                        :class="{
                            'bg-success-6 border-none': step.status === 'complete',
                            'bg-success-3 border border-success-3 shadow-inner-white-2p': step.status === 'current',
                            'bg-white border border-1p border-neutrals-100': step.status === 'upcoming',
                        }"
                    >
                        <icon-component v-if="step.status === 'complete'" name="check" color="white" />
                        <span
                            class="text-14"
                            :class="{ 'text-white': ['current', 'complete'].includes(step.status) }"
                            v-else-if="type == 'number'"
                            >{{ stepIdx + 1 }}</span
                        >
                        <icon-component
                            v-else-if="type == 'icon'"
                            :name="step.icon"
                            :color="step.status === 'current' ? 'white' : 'neutrals-300'"
                        >
                        </icon-component>
                        <span class="sr-only">{{ step.name }}</span>
                    </span>
                    <div v-if="type === 'icon'" class="text-12 mt-16p whitespace-nowrap" style="white-space: nowrap">
                        STEP {{ stepIdx + 1 }}
                    </div>
                    <div
                        class="text-14"
                        :class="{
                            'mt-8p': type === 'icon',
                            'mt-16p': type === 'number',
                            'font-normal': step.status === 'complete',
                            'font-medium text-neutrals-300': step.status === 'upcoming',
                            'font-bold': step.status === 'current',
                        }"
                        style="white-space: nowrap"
                    >
                        {{ step.label }}
                    </div>
                </div>
                <div
                    v-if="steps.length - 1 !== stepIdx"
                    class="relative flex-1 items-center px-16p self-start top-14p"
                    aria-hidden="true"
                >
                    <div
                        class="h-2 bg-neutrals-100 mx-auto rounded-2p"
                        :class="{
                            'bg-success-6': step.status === 'complete',
                        }"
                    />
                </div>
            </template>
            <div class="opacity-0 relative flex-1 items-center px-16p self-start top-14p" aria-hidden="true">
                <div class="h-2 bg-neutrals-100 mx-auto rounded-2p" />
            </div>
        </ol>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';

export default defineComponent({
    name: 'StepComponent',
    props: {
        currentStepIndex: {
            type: Number,
            default: 0,
        },
        steps: {
            type: Array,
            default: () => {
                return [{ name: 'Step 1', label: 'Label task', icon: 'person' }];
            },
        },
        type: {
            type: String,
            default: 'icon',
        },
        align: {
            type: String,
            default: 'vertical',
        },
    },
    components: {
        IconComponent,
    },
    setup(props) {
        const stepDataDisplay = computed(() => {
            return props.steps.map((item: any, index: number) => {
                if (index < props.currentStepIndex) {
                    item.status = 'complete';
                }
                if (index === props.currentStepIndex) {
                    item.status = 'current';
                }
                if (index > props.currentStepIndex) {
                    item.status = 'upcoming';
                }
                return item;
            });
        });

        return {
            stepDataDisplay,
        };
    },
});
</script>

<style scoped lang="scss"></style>
