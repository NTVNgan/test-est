<template>
    <div ref="configSegmentHTML" class="inline-block text-left" v-click-outside="closeOption">
        <tooltip-component position="bottom-right" :content="'Choose segment to show'">
            <div @click="open = !open">
                <slot></slot>
            </div>
        </tooltip-component>
        <keep-alive>
            <div
                v-if="open"
                class="
                    mr-16p
                    mt-4p
                    z-10
                    origin-top-right
                    absolute
                    right-0
                    rounded-md
                    shadow-deep-1
                    bg-white
                    ring-1 ring-black ring-opacity-5
                    focus:outline-none
                "
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabindex="-1"
            >
                <div class="py-1 check-box-config-segment" role="none">
                    <list-group
                        typeList="checkbox"
                        class="m-auto"
                        showSearch
                        selectAll
                        v-model="selected"
                        :heightList="handleHeightModalConfig + 'px'"
                        @changeTextSearch="onChangeValue"
                        @clickCheckbox="clickCheckbox"
                        @selectAllOrClearAll="selectAllOrClearAll"
                        :placeholderSearch="'Search segment'"
                        :showBtnSelectAllClearAll="true"
                    >
                        <template #title>Choose segment to show</template>
                        <list-item type="checkbox" v-for="(item, index) in segmentsSearched" :key="index">
                            <CheckBoxCustom :value="item.id" name="segment" :disabled="item.disabled">
                                <template v-slot:label>{{ item.name }}</template>
                            </CheckBoxCustom>
                        </list-item>
                    </list-group>
                    <div class="pl-8p pr-8p pb-4p">
                        <ButtonComponent @click="clickApply" class="w-100% justify-center" type="primary" size="medium">
                            Apply
                        </ButtonComponent>
                    </div>
                </div>
            </div>
        </keep-alive>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed, watch } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ListGroup from '@/components/ui/ListComponent.vue';
import ListItem from '@/components/ui/ListItemComponent.vue';
import CheckBoxCustom from '@/components/ui/CheckboxCustom.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import { useSegment } from '@/modules/contact/composables/useSegment';
import debounce from 'lodash/debounce';
import { useToast } from '@/composables/useToast';

export default defineComponent({
    name: 'ContactListConfigSegment',
    components: {
        ButtonComponent,
        ListGroup,
        ListItem,
        CheckBoxCustom,
        TooltipComponent,
    },
    emits: ['change', 'updateShowHide'],
    setup(props, { emit }) {
        const open = ref<boolean>(false);
        const selected = ref<any>([]);
        const segmentShowAndHide = ref<any>([]);
        const statusInitContactListData: any = inject('statusInitContactListData');
        const { getListSegmentBySearch, segmentsSearched, updateMultiSegmentShowHide, showSkeleton } = useSegment();
        const searchValue = ref('');
        const { addToast } = useToast();
        const configSegmentHTML = ref<HTMLElement>();

        const onChangeValue = (value: any) => {
            searchValue.value = value;
        };

        const clickCheckbox = (value: any) => {
            const findIndex = segmentShowAndHide.value.indexOf(value);
            if (findIndex < 0) segmentShowAndHide.value.push(value);
            else segmentShowAndHide.value.splice(findIndex, 1);
        };

        const selectAllOrClearAll = (value: any) => {
            segmentShowAndHide.value = [];
            if (value == 'selectAll') {
                segmentsSearched.value.forEach((segment: any) => {
                    if (!segment.showing) segmentShowAndHide.value.push(segment.id);
                });
            } else {
                segmentsSearched.value.forEach((segment: any) => {
                    if (segment.showing) segmentShowAndHide.value.push(segment.id);
                });
            }
        };

        const setDefaultSeletedValue = () => {
            segmentsSearched.value.forEach((item: any) => {
                if (item.showing) selected.value.push(item.id);
            });
        };

        statusInitContactListData.value === 'done' && setDefaultSeletedValue();

        const closeOption = () => {
            open.value = false;
            searchValue.value = '';
        };

        const clickApply = async () => {
            const data = {
                toggle_view: {},
            };
            if (segmentShowAndHide.value.length > 0) {
                segmentShowAndHide.value.forEach((segmentId: any) => {
                    const findSegment = segmentsSearched.value.find((segment: any) => segment.id === segmentId);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore: Unreachable code error
                    if (findSegment) data.toggle_view[segmentId] = !findSegment.showing;
                });
                const res = await updateMultiSegmentShowHide(data);
                if (!res.error) {
                    showSkeleton.value = true;
                    let timeOut = 500;
                    if (res.data.total > 50) timeOut = 1000;
                    if (res.data.total > 100) timeOut = 1500;
                    if (res.data.total > 150) timeOut = 2300;
                    if (res.data.total > 170) timeOut = 3000;
                    await new Promise(resolve => setTimeout(resolve, timeOut));
                    showSkeleton.value = false;
                    addToast({
                        title: 'Applied segment view successfully',
                        type: 'basic',
                        timeout: 3000,
                    });
                    emit('updateShowHide');
                }
            }
            open.value = false;
        };

        const callSegmentBySearch = async () => {
            await getListSegmentBySearch(searchValue.value);
            await setDefaultSeletedValue();
        };

        const handleHeightModalConfig = computed(() => {
            let position = 228;
            if (configSegmentHTML.value) {
                position = window.innerHeight - configSegmentHTML.value.getBoundingClientRect().bottom - 150;
            }
            if (position > 228 || position < 0) return 228;
            return position;
        });

        watch(statusInitContactListData, (value: string) => {
            if (value === 'done') {
                setDefaultSeletedValue();
            }
        });

        // watch(
        //     searchValue,
        //     debounce(newVal => {
        //         if (newVal || newVal == '') {
        //             callSegmentBySearch();
        //         }
        //     }, 2000),
        // );

        watch(
            () => open.value,
            () => {
                segmentShowAndHide.value = [];
                selected.value = [];
                if (open.value) {
                    callSegmentBySearch();
                } else {
                    searchValue.value = '';
                }
            },
            { deep: true },
        );

        return {
            selected,
            open,
            onChangeValue,
            clickCheckbox,
            segmentsSearched,
            closeOption,
            clickApply,
            selectAllOrClearAll,
            configSegmentHTML,
            handleHeightModalConfig,
        };
    },
});
</script>

<style lang="scss">
.list-component__checkbox {
    width: 256px;
}
</style>
<style>
.check-box-config-segment .checkbox-text {
    width: calc(100% - 17px - 0px);
}
.check-box-config-segment .checkbox-text span.tooltip__title {
    width: 100%;
}
</style>
