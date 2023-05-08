<template>
    <Card type="shadow" class="relative mb-24p pb-24p max-h-500 flex flex-col" :class="{ 'h-500': searchValue !== '' }">
        <div class="h-56 flex items-center justify-between px-24p py-10p">
            <p class="text-primary-500 text-16 font-bold mr-64p whitespace-nowrap">
                {{ $t('contact.contact_detail_customer_info_accordion_customer_data') }}
            </p>
            <template v-if="attributes.length > 15">
                <Input
                    class="w-full"
                    v-model="searchValue"
                    :closeIcon="true"
                    type="text"
                    :placeholder="$t('contact.contact_detail_customer_data_search_placeholder')"
                >
                    <template v-slot:prefix>
                        <icon-component name="Search"></icon-component>
                    </template>
                </Input>
            </template>
        </div>
        <div
            v-if="!attributes.length"
            class="px-24p text-14"
            :class="[disableInfo ? 'text-neutrals-200' : 'text-neutrals-400']"
        >
            {{ $t('contact.contact_detail_customer_data_empty') }}
        </div>
        <div
            v-else
            class="flex-1 pl-16p overflow-y-auto scrollbar--transparent"
            :class="{ 'pr-16p': attributesSearch.length <= 15 }"
        >
            <div class="h-full">
                <div
                    v-show="attributesSearch.length"
                    v-for="attribute in attributesSearch"
                    :key="attribute"
                    class="grid grid-cols-2 text-14 px-8p py-4p"
                >
                    <Tooltip
                        class="pr-4p text-neutrals-400"
                        size="small"
                        type="light"
                        position="top"
                        showByTruncate
                        :content="attribute.name"
                        :timeout="1000"
                    >
                        <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                            {{ attribute.name }}
                        </span>
                    </Tooltip>
                    <Tooltip
                        class="pl-4p"
                        size="small"
                        type="light"
                        position="top"
                        showByTruncate
                        :content="attribute.value"
                        :timeout="1000"
                    >
                        <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                            {{
                                attribute.datatype === 3 ? filters.formatTime(attribute.value, false) : attribute.value
                            }}
                        </span>
                    </Tooltip>
                </div>
                <div v-show="!attributesSearch.length" class="h-full flex flex-col items-center justify-center">
                    <div class="w-324">
                        <img src="../images/no-data.svg" alt="no-data" class="h-120 w-120 mx-auto" />
                        <p class="text-center break-words">
                            {{ $t('contact.contact_detail_customer_data_search_empty', { searchValue }) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </Card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Card from '@/components/ui/CardComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import Tooltip from '@/components/ui/TooltipComponent.vue';
import filters from '@/utils/filters';
export default defineComponent({
    name: 'ContactDetailCustomerData',
    props: {
        attributes: {
            type: Array,
            default: null,
        },
        disableInfo: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        Card,
        Input,
        Tooltip,
        IconComponent,
    },
    setup(props: any) {
        const searchValue = ref<string>('');
        const attributesSearch = computed(() => {
            if (searchValue.value !== '') {
                return props.attributes.filter((item: any) => {
                    const searchName = searchValue.value.toLowerCase();
                    const itemName = item.name.toLowerCase();
                    return itemName.toLowerCase().includes(searchName);
                });
            }
            return props.attributes;
        });
        return {
            searchValue,
            attributesSearch,
            filters,
        };
    },
});
</script>

<style lang="scss" scoped>
.whitespace-nowrap {
    white-space: nowrap;
}
</style>
