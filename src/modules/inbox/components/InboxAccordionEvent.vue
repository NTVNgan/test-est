<template>
    <accordion-tab>
        <div class="text-14 px-8p py-16p">
            <span v-if="!events.length" class="text-neutrals-400">No event found</span>
            <template v-else>
                <div v-for="item in events" :key="item" class="flex text-14 px-8p py-4p">
                    <div class="flex-1 mr-4p truncate text-neutrals-400">Article ID</div>
                    <div class="flex-1 ml-4p truncate">000234842</div>
                </div>
                <div class="flex text-14 p-4p" v-if="events.length >= 15">
                    <Button @click="showUnpinList = !showUnpinList" size="medium" type="link">{{
                        showUnpinList ? $t('inbox.inbox_btn_view_less') : $t('inbox.inbox_btn_view_more')
                    }}</Button>
                </div>
                <template v-if="showUnpinList">
                    <Input class="my-4p" :placeholder="$t('inbox.inbox_placeholder_search')">
                        <template v-slot:prefix>
                            <Icon name="search"></Icon>
                        </template>
                    </Input>
                    <div v-for="item in events" :key="item" class="flex text-14 px-8p py-4p">
                        <div class="flex-1 mr-4p truncate text-neutrals-400">Article ID</div>
                        <div class="flex-1 ml-4p truncate">000234842</div>
                    </div>
                </template>
            </template>
        </div>
    </accordion-tab>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import AccordionTab from '@/components/ui/AccordionPanel.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import Icon from '@/components/ui/IconComponent.vue';
export default defineComponent({
    name: 'InboxAccordionEvent',
    components: {
        AccordionTab,
        Button,
        Input,
        Icon,
    },
    setup() {
        const events = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        const showUnpinList = ref<boolean>(false);
        return {
            events,
            showUnpinList,
        };
    },
});
</script>
