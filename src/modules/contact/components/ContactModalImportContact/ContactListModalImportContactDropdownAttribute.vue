<template>
    <new-dropdown-component class="test" width="256px" v-model="showSelect" position="bottom-right">
        <div
            class="select h-36 w-full relative text-14 bg-white text-neutrals-900 py-8p pl-12p pr-24p outline-none flex items-center justify-between rounded border hover:border-primary-500"
            :class="!showSelect ? 'border-neutrals-200' : 'border-primary-500'"
        >
            <span class="truncate">{{ getAttrNameById(modelValueSync) }}</span>
            <icon-component
                v-if="!modelValueSync"
                class="absolute right-4p top-8p"
                name="angle-down"
                color="neutrals-900"
            />
            <i v-else class="absolute right-4p top-8p" @click.stop.prevent="modelValueSync = ''">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.4395 9.97266L14.3926 7.04688C14.5566 6.88281 14.5566 6.58203 14.3926 6.41797L13.709 5.73438C13.5449 5.57031 13.2441 5.57031 13.0801 5.73438L10.1543 8.6875L7.20117 5.73438C7.03711 5.57031 6.73633 5.57031 6.57227 5.73438L5.88867 6.41797C5.72461 6.58203 5.72461 6.88281 5.88867 7.04688L8.8418 9.97266L5.88867 12.9258C5.72461 13.0898 5.72461 13.3906 5.88867 13.5547L6.57227 14.2383C6.73633 14.4023 7.03711 14.4023 7.20117 14.2383L10.1543 11.2852L13.0801 14.2383C13.2441 14.4023 13.5449 14.4023 13.709 14.2383L14.3926 13.5547C14.5566 13.3906 14.5566 13.0898 14.3926 12.9258L11.4395 9.97266Z"
                        fill="#141417"
                    />
                </svg>
            </i>
        </div>
        <template #content>
            <list-component
                showSearch
                heightList="212px"
                typeActive="selected"
                placeholderSearch="Search"
                v-model="modelValueSync"
                class="font-body"
            >
                <template #title>
                    {{ $t('contact.contact_import_modal_attribute_mapping_droplist_description') }}
                </template>
                <list-item-component
                    v-for="(item, index) in attributesList"
                    :key="item"
                    :value="item._id"
                    :activeSingle="listAttrSelected.includes(item._id)"
                >
                    {{ item.name }}
                    <template #suffix v-if="index < 3">
                        <badge-chip-component status="info" content="Required" />
                    </template>
                </list-item-component>
            </list-component>
        </template>
    </new-dropdown-component>
</template>

<script lang="ts">
import { defineComponent, ref, computed, inject, watch, onMounted, onUnmounted } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import NewDropdownComponent from '@/components/ui/NewDropdownComponent.vue';
import ListComponent from '@/components/ui/ListComponent.vue';
import ListItemComponent from '@/components/ui/ListItemComponent.vue';
import BadgeChipComponent from '@/components/ui/BadgeChipComponent.vue';

export default defineComponent({
    name: 'ContactListModalImportContactDropdownAttribute',
    props: {
        listAttrSelected: {
            type: Array,
            default: () => [],
        },
        modelValue: {
            type: String,
            default: '',
        },
    },
    components: {
        IconComponent,
        NewDropdownComponent,
        ListComponent,
        ListItemComponent,
        BadgeChipComponent,
    },
    setup(props, { emit }) {
        const emitter: any = inject('emitter');
        const attributes: any = inject('attributes');
        const showSelect = ref(false);

        const modelValueSync = computed({
            get(): string {
                return props.modelValue;
            },
            set(value: string) {
                emit('update:modelValue', value);
            },
        });

        const attributesList = computed(() => {
            if (attributes.list.value.length) {
                const attrFullName = attributes.list.value.find((item: any) => item._id === 'full_name');
                const attrEmail = attributes.list.value.find((item: any) => item._id === 'email');
                const attrCustomerId = attributes.list.value.find((item: any) => item._id === 'hash_id');
                return [
                    attrFullName,
                    attrEmail,
                    attrCustomerId,
                    ...attributes.list.value.filter(
                        (item: any) => !['full_name', 'email', 'hash_id'].includes(item._id),
                    ),
                ];
            }
            return [];
        });

        const getAttrNameById = (id: string) => {
            if (!id) {
                return 'Choose attribute';
            }
            const findAttr = attributes.list.value.find((item: any) => item._id === id);
            return findAttr.name;
        };

        const hideDropdown = () => {
            if (showSelect.value) {
                showSelect.value = false;
            }
        };

        watch(
            () => props.modelValue,
            () => {
                showSelect.value = false;
            },
        );

        onMounted(() => {
            emitter.on('listAttrMappingScroll', hideDropdown);
        });

        onUnmounted(() => {
            emitter.off('listAttrMappingScroll', hideDropdown);
        });

        return {
            showSelect,
            attributesList,
            modelValueSync,
            getAttrNameById,
        };
    },
});
</script>

<style lang="scss" scoped>
.select {
    &:hover {
        box-shadow: 0 0 0 2px rgb(62 109 218 / 20%);
    }
}
</style>
