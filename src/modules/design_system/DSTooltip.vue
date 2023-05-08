<template>
    <div class="ds-tooltip p-12p">
        <div class="grid grid-flow-col grid-cols-3 mb-16p">
            <div class="type">
                <label for="type" class="block text-sm font-semibold text-gray-700 mb-4p text-center">Type</label>
                <select
                    v-model="type"
                    id="type"
                    name="type"
                    class="m-auto mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option :value="'light'">Light</option>
                    <option :value="'dark'">Dark</option>
                </select>
            </div>
            <div class="size">
                <label for="size" class="block text-sm font-semibold text-gray-700 mb-4p text-center">Size</label>
                <select
                    v-model="size"
                    id="size"
                    name="size"
                    class="m-auto mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option :value="'small'">Small</option>
                    <option :value="'large'">Large</option>
                </select>
            </div>
            <div class="position">
                <label for="size" class="block text-sm font-semibold text-gray-700 mb-4p text-center">Position</label>
                <select
                    v-model="position"
                    id="position"
                    name="position"
                    class="m-auto mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option :value="'top'">Top</option>
                    <option :value="'top-left'">Top Left</option>
                    <option :value="'top-right'">Top Right</option>
                    <option :value="'bottom'">Bottom</option>
                    <option :value="'bottom-left'">Bottom Left</option>
                    <option :value="'bottom-right'">Bottom Right</option>
                    <option :value="'left'">Left</option>
                    <option :value="'left-top'">Left Top</option>
                    <option :value="'left-bottom'">Left Bottom</option>
                    <option :value="'right'">Right</option>
                    <option :value="'right-top'">Right Top</option>
                    <option :value="'right-bottom'">Right Bottom</option>
                </select>
            </div>
        </div>
        <div class="grid grid-flow-col grid-cols-2 mb-16p">
            <div class="border-r-2 p-12p text-center">
                <tooltip-component
                    class="inline-block"
                    :type="type"
                    :size="size"
                    :position="position"
                    content="This is a small tooltip."
                    label="Tooltip"
                >
                    <span>Tooltip</span>
                </tooltip-component>
            </div>
            <div class="p-12p text-center">
                <tooltip-component
                    class="inline-block"
                    :type="type"
                    :size="size"
                    :position="position"
                    content="This is a large and dark tooltip. This is a large and dark tooltip. This is a large and dark tooltip. This is a large and dark tooltip."
                    label="Tooltip"
                >
                    <span>Tooltip</span>
                </tooltip-component>
            </div>
        </div>
        <div class="grid grid-flow-col grid-cols-2 mb-16p">
            <div class="p-12p text-center">
                <tooltip-component class="inline-block" type="light" position="bottom" label="Tooltip">
                    <span>Test button copy in tooltip - pos: bottom</span>
                    <template #content>
                        <div class="flex items-center">
                            <span>This is a small tooltip.</span>
                            <tooltip-component
                                class="inline-block"
                                type="dark"
                                position="top"
                                content="Copied"
                                label="Tooltip"
                                showByClick
                            >
                                <icon-component name="copy" class="cursor-pointer hover:text-primary-500" />
                            </tooltip-component>
                        </div>
                    </template>
                </tooltip-component>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';

export default defineComponent({
    name: 'Tooltip',
    components: {
        TooltipComponent,
        IconComponent,
    },
    data() {
        return {
            type: 'dark',
            size: 'small',
            position: 'right',
        };
    },
});
</script>

<style lang="scss">
.ds-tooltip {
    .tooltip-component {
        margin: 0 auto;
    }
}
</style>
