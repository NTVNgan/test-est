<template>
    <div class="inline-block text-left" v-click-outside="closeOption">
        <tooltip-component position="bottom-right" :content="$t('contact.contact_list_config_tooltip_title')">
            <div @click="open = !open">
                <slot></slot>
            </div>
        </tooltip-component>
        <keep-alive>
            <div
                v-if="open"
                class="
                    mt-10p
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
                <div class="py-1" role="none">
                    <list-group
                        typeList="checkbox"
                        class="m-auto"
                        showSearch
                        selectAll
                        v-model="selected"
                        heightList="220px"
                        @clickCheckbox="onChangeValue"
                        @selectAllOrClearAll="onChangeAll"
                        :placeholderSearch="$t('contact.contact_detail_customer_data_search_placeholder')"
                        :showBtnSelectAllClearAll="true"
                        :blockList="arrAttributeHide"
                    >
                        <template #title>Choose attributes to show</template>
                        <list-item type="checkbox" v-for="(item, index) in attributesList" :key="index">
                            <CheckBoxCustom :value="item._id" name="attribute" :disabled="item.disabled">
                                <template v-slot:label>{{ item.name }}</template>
                            </CheckBoxCustom>
                        </list-item>
                    </list-group>
                </div>
            </div>
        </keep-alive>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed, watch, provide } from 'vue';
import ListGroup from '@/components/ui/ListComponent.vue';
import ListItem from '@/components/ui/ListItemComponent.vue';
import CheckBoxCustom from '@/components/ui/CheckboxCustom.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import { useSocket } from '@/composables/useSocket';
import { useToast } from '@/composables/useToast';

export default defineComponent({
    name: 'ContactListConfigDropdown',
    components: {
        ListGroup,
        ListItem,
        CheckBoxCustom,
        TooltipComponent,
    },
    emits: ['change'],
    setup(props, { emit }) {
        const defaultAtrr = ['phone', 'country', 'signed_up', 'last_seen'];
        const open = ref<boolean>(false);
        const contactSetting: any = inject('contactSetting');
        const selected = ref<any>(['email', 'full_name', ...contactSetting.list.value]);
        const attributes: any = inject('attributes');
        const attributesList = computed(() => attributes.list.value);
        const statusInitContactListData: any = inject('statusInitContactListData');
        const { socket } = useSocket();
        const { addToast } = useToast();
        const emitter: any = inject('emitter');
        const arrAttributeHide: any = inject('arrAttributeHide');

        const onChangeValue = (value: any) => {
            emitter.emit('clickValueCheckbox', value);
        };

        const onChangeAll = (value: any) => {
            emitter.emit('clickValueCheckbox');
        };

        const setDefaultSeletedValue = () => {
            selected.value = [
                'email',
                'full_name',
                ...contactSetting.list.value.map((item: string) => {
                    return item.includes('attr_') ? item.replace('attr_', '') : item;
                }),
            ];
        };

        statusInitContactListData.value === 'done' && setDefaultSeletedValue();

        const closeOption = () => {
            open.value = false;
        };


        watch(selected, (oldVal, newVal) => {
            if (oldVal !== null) {
                const difNum = oldVal.length - newVal.length;
                if (Math.abs(difNum) === 1) {
                    if (oldVal.length < newVal.length) {
                        newVal.forEach((value: any) => {
                            if (!oldVal.includes(value)) {
                                emit('change', {
                                    value: attributesList.value.find((item: any) => item._id === value),
                                    type: 'sub',
                                });
                            }
                        });
                    }
                    if (oldVal.length > newVal.length) {
                        oldVal.forEach((value: any) => {
                            if (!newVal.includes(value)) {
                                emit('change', {
                                    value: attributesList.value.find((item: any) => item._id === value),
                                    type: 'plus',
                                });
                            }
                        });
                    }
                } else {
                    if (difNum > 0) {
                        emit('change', {
                            value: attributesList.value.filter((item: any) => item._id !== 'email'),
                            type: 'all',
                        });
                    } else {
                        emit('change', {
                            value: { name: 'Full name', _id: 'name', disabled: true },
                            type: 'un-all',
                        });
                    }
                }
            }
        });

        watch(statusInitContactListData, (value: string) => {
            if (value === 'done') {
                setDefaultSeletedValue();
            }
        });

        return {
            selected,
            open,
            attributesList,
            onChangeValue,
            closeOption,
            arrAttributeHide,
            onChangeAll
        };
    },
});
</script>

<style lang="scss">
.list-component__checkbox {
    width: 256px;
}
</style>