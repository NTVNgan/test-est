<template>
    <div class="text-14 px-8p py-16p cursor-default">
        <span v-if="!attributes.length" class="text-neutrals-400">{{ $t('inbox.inbox_customer_data_empty') }}</span>
        <template v-else>
            <div v-for="attribute in attributes" :key="attribute" class="grid grid-cols-2 text-14 px-8p py-4p">
                <Tooltip
                    class="pr-4p text-neutrals-400"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :content="attribute.name.toString()"
                    :timeout="1000"
                >
                    <span class="truncate inline-block w-full">
                        {{ attribute.name }}
                    </span>
                </Tooltip>
                <Tooltip
                    class="pl-4p"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :content="attribute.value.toString()"
                    :timeout="1000"
                >
                    <span class="truncate inline-block w-full">
                        {{ attribute.datatype === 3 ? filters.formatTime(attribute.value, false) : attribute.value }}
                    </span>
                </Tooltip>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Tooltip from '@/components/ui/TooltipComponent.vue';
import filters from '@/utils/filters';
export default defineComponent({
    name: 'InboxAccordionCustomerData',
    props: {
        attributes: {
            type: Array,
            default: null,
        },
    },
    components: {
        Tooltip,
    },
    setup() {
        return {
            filters,
        };
    },
});
</script>

<style lang="scss" scoped>
.attribute__list {
    min-height: 328px;
}
</style>
