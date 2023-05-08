<template>
    <div class="flex justify-around">
        <div class="mx-4">
            <label for="Type" class="block text-sm font-medium text-gray-700">Type</label>
            <select
                v-model="type"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
                <option>default</option>
                <option>segmented</option>
            </select>
        </div>
        <div class="flex flex-col">
            <button-group :type="type" class="mt-2 mb-4">
                <button-component><icon-component name="chevron-left" color="white" /> </button-component>
                <button-component>1</button-component>
                <button-component>2</button-component>
                <button-component><icon-component name="chevron-right" color="white" /> </button-component>
            </button-group>
            <button-group :type="type" class="mt-2 mb-4">
                <button-component type="outline"
                    ><icon-component name="chevron-left" color="black" />
                </button-component>
                <button-component type="outline">1</button-component>
                <button-component type="outline">2</button-component>
                <button-component type="outline"
                    ><icon-component name="chevron-right" color="black" />
                </button-component>
            </button-group>
            <button-group :type="type" class="mt-2 mb-4">
                <button-component type="secondary"
                    ><icon-component name="chevron-left" color="black" />
                </button-component>
                <button-component type="secondary">1</button-component>
                <button-component type="secondary">2</button-component>
                <button-component type="secondary"
                    ><icon-component name="chevron-right" color="black" />
                </button-component>
            </button-group>
            <button-group :type="type" class="mt-2 mb-4">
                <button-component type="subtle"><icon-component name="chevron-left" color="black" /> </button-component>
                <button-component type="subtle">1</button-component>
                <button-component type="subtle">2</button-component>
                <button-component type="subtle"
                    ><icon-component name="chevron-right" color="black" />
                </button-component>
            </button-group>
            <button-group :type="type" class="mt-2 mb-4">
                <button-component type="secondary" disabled
                    ><icon-component name="chevron-left" color="black" />
                </button-component>
                <button-component type="secondary" disabled>1 </button-component>
                <button-component type="secondary" disabled>2 </button-component>
                <button-component type="secondary" disabled
                    ><icon-component name="chevron-right" color="black" />
                </button-component>
            </button-group>
            <button-group :type="type" class="mt-2 mb-4">
                <button-component type="primary"><icon-component name="chevron-left" color="white"/></button-component>
                <button-component type="primary"><icon-component name="chevron-right" color="white"/></button-component>
            </button-group>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonGroup from '@/components/ui/ButtonGroupComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
export default defineComponent({
    data() {
        return {
            type: 'default',
        };
    },
    components: {
        ButtonGroup,
        ButtonComponent,
        IconComponent,
    },
});
</script>

<style lang="scss" scoped></style>
