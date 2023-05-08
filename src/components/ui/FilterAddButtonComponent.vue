<template>
    <dropdown-component v-click-outside="hideDropdown">
        <template #header>
            <div ref="filterEl">
                <slot name="button"></slot>
            </div>
        </template>
        <template #list>
            <div
                ref="dropdownEl"
                v-if="showDropdownSync"
                :style="{
                    right: dropdownRight !== 'auto' ? `${dropdownRight}px` : dropdownRight,
                    left: dropdownLeft !== 'auto' ? `${dropdownLeft}px` : dropdownLeft,
                    top: dropdownTop !== 'auto' ? `${dropdownTop}px` : dropdownTop,
                    bottom: dropdownBottom !== 'auto' ? `${dropdownBottom}px` : dropdownBottom,
                }"
                class="z-999 relative mb-24p w-256 bg-white text-14 rounded-4p shadow-deep-1 font-body filter__list"
            >
                <list-component showSearch placeholderSearch="Search" heightList="220px" v-model="modelValueSync">
                    <template #title>{{ $t('ui_component.filter_list_attribute_title') }}</template>
                    <list-item-component
                        v-for="(item, index) in filtersValue"
                        :key="'filter-value-' + index"
                        :value="item"
                    >
                        {{ item.name }}
                    </list-item-component>
                </list-component>
            </div>
        </template>
    </dropdown-component>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick, watch } from 'vue';
import DropdownComponent from '@/components/ui/DropdownComponent.vue';
import ListComponent from '@/components/ui/ListComponent.vue';
import ListItemComponent from '@/components/ui/ListItemComponent.vue';
export default defineComponent({
    name: 'FilterAddButtonComponent',
    components: {
        DropdownComponent,
        ListComponent,
        ListItemComponent,
    },
    props: {
        modelValue: {
            type: Object,
            default: null,
        },
        showDropdown: {
            type: Boolean,
            default: false,
        },
        filtersValue: {
            type: Array,
            default: () => [],
        },
    },
    setup(props, { emit }) {
        const filterEl = ref<HTMLElement>();
        const dropdownEl = ref<HTMLElement>();
        const dropdownRight = ref<number | string>('auto');
        const dropdownLeft = ref<number | string>('auto');
        const dropdownTop = ref<number | string>('auto');
        const dropdownBottom = ref<number | string>('auto');

        const modelValueSync = computed({
            get(): any {
                return props.modelValue;
            },
            set(value: any) {
                emit('update:modelValue', value);
            },
        });
        const showDropdownSync = computed({
            get(): boolean {
                return props.showDropdown;
            },
            set(value: boolean) {
                emit('update:showDropdown', value);
            },
        });

        const setPositionDropdown = () => {
            if (dropdownEl.value && filterEl.value) {
                dropdownTop.value = 4;
                dropdownBottom.value = 'auto';
            }
        };

        const hideDropdown = () => {
            showDropdownSync.value = false;
        };

        watch(
            () => showDropdownSync.value,
            async (newVal: boolean) => {
                if (newVal) {
                    modelValueSync.value = null;
                    await nextTick();
                    setPositionDropdown();
                }
            },
        );

        return {
            filterEl,
            dropdownEl,
            dropdownRight,
            dropdownLeft,
            dropdownTop,
            dropdownBottom,
            showDropdownSync,
            hideDropdown,
            modelValueSync,
        };
    },
});
</script>

<style lang="scss" scoped></style>
