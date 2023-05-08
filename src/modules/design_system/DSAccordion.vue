<template>
    <div class="p-12p">
        <label class="text-center block text-16 font-bold text-gray-700 mb-16p">Bare</label>
        <div class="grid grid-flow-col grid-cols-2">
            <div class="border-r-2">
                <label class="text-center block text-16 font-bold text-gray-700 mb-16p">Single</label>
                <Accordion noBorder :activeIndex="0">
                    <accordion-tab header="Item 1" icon="Clone">
                        <div class="text-14">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text
                        </div>
                    </accordion-tab>
                    <accordion-tab header="Item 2" icon="Inbox">
                        <div class="text-14">
                            <p>
                                You can crush me but you can't crush my spirit! Are you crazy? I can't swallow that.
                                Who's brave enough to fly into something we all keep calling a death sphere? It doesn't
                                look so shiny to me.
                            </p>
                            <ul>
                                <li>I just want to talk.</li>
                                <li>It has nothing to do with mating.</li>
                                <li>Fry, that doesn't make sense.</li>
                            </ul>
                        </div>
                    </accordion-tab>
                </Accordion>
            </div>
            <div class="ml-24p">
                <label class="text-center block text-16 font-bold text-gray-700 mb-16p">Multiple</label>
                <Accordion noBorder multiple>
                    <accordion-tab v-for="(tab, i) in dataAccordion" :key="i" :header="tab.label">
                        <div class="text-14">
                            {{ tab.value }}
                        </div>
                    </accordion-tab>
                </Accordion>
            </div>
        </div>
        <label class="text-center block text-16 font-bold text-gray-700 mb-12p mt-12p">Basic</label>
        <div class="grid grid-flow-col grid-cols-2">
            <div class="border-r-2">
                <label class="text-center block text-16 font-bold text-gray-700 mb-16p">Single</label>
                <Accordion>
                    <accordion-tab header="Item 1" icon="Clone">
                        <div class="text-14">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text
                        </div>
                    </accordion-tab>
                    <accordion-tab header="Item 2" icon="Inbox">
                        <div class="text-14">
                            <p>
                                You can crush me but you can't crush my spirit! Are you crazy? I can't swallow that.
                                Who's brave enough to fly into something we all keep calling a death sphere? It doesn't
                                look so shiny to me.
                            </p>
                            <ul>
                                <li>I just want to talk.</li>
                                <li>It has nothing to do with mating.</li>
                                <li>Fry, that doesn't make sense.</li>
                            </ul>
                        </div>
                    </accordion-tab>
                </Accordion>
            </div>
            <div class="ml-24p">
                <label class="text-center block text-16 font-bold text-gray-700 mb-16p">Multiple</label>
                <Accordion multiple>
                    <accordion-tab v-for="(tab, i) in dataAccordion" :key="i" :header="tab.label">
                        <div class="text-14">
                            {{ tab.value }}
                        </div>
                    </accordion-tab>
                </Accordion>
            </div>
        </div>
        <label class="text-center block text-16 font-bold text-gray-700 mb-12p mt-12p">Drap & Drop</label>
        <div class="grid grid-flow-col grid-cols-2">
            <div class="border-r-2">
                <label class="text-center block text-16 font-bold text-gray-700 mb-16p">Single</label>
                <DrapDrop v-model:activeKey="indexDrap">
                    <accordion-tab header="Item 1" :key="1">
                        <div class="text-14 py-12p">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text
                        </div>
                    </accordion-tab>
                    <accordion-tab header="Item 2" :key="2">
                        <div class="text-14 py-12p">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text
                        </div>
                    </accordion-tab>
                    <accordion-tab header="Item 3" :key="3">
                        <div class="text-14 py-12p">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text
                        </div>
                    </accordion-tab>
                    <accordion-tab header="Item 4" :key="4">
                        <div class="text-14 py-12p">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text
                        </div>
                    </accordion-tab>
                </DrapDrop>
            </div>
            <div class="ml-24p">
                <label class="text-center block text-16 font-bold text-gray-700 mb-16p">Multiple</label>
                <DrapDrop multiple v-model:activeKey="indexDrap1">
                    <accordion-tab header="Item 1" :key="1">
                        <div class="text-14 py-12p">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text
                        </div>
                    </accordion-tab>
                    <accordion-tab header="Item 2" :key="2">
                        <div class="text-14 py-12p">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text
                        </div>
                    </accordion-tab>
                </DrapDrop>
            </div>
        </div>
        <div class="">
            <nested-draggable :tasks="list" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import Accordion from '@/components/ui/AccordionComponent.vue';
import AccordionTab from '@/components/ui/AccordionPanel.vue';
import DrapDrop from '@/components/ui/AccordionDrapDrop.vue';
import NestedDraggable from '@/components/ui/AccordionNested.vue';

export default defineComponent({
    name: 'Accordion Component',
    components: {
        Accordion,
        AccordionTab,
        DrapDrop,
        NestedDraggable,
    },
    order: 1,
    setup() {
        const indexDrap = ref([1, 3, 2, 4]);
        const indexDrap1 = ref([1, 2]);
        const dataAccordionIcon = reactive([
            {
                key: 1,
                label: 'Item 1',
                value: `
      <p>You can crush me but you can't crush my spirit! Are you crazy? I can't swallow that. Who's brave enough to fly into something we all keep calling a death sphere? It doesn't look so shiny to me.</p>
      <ul>
        <li>I just want to talk.</li>
        <li>It has nothing to do with mating.</li>
        <li>Fry, that doesn't make sense.</li>
      </ul>
    `,
                icon: 'inbox',
            },
            {
                key: 2,
                label: 'Item 2',
                value: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
                icon: 'inbox',
            },
            {
                key: 3,
                label: 'Item 3',
                value: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
                icon: 'Clone',
            },
        ]);
        const dataAccordion = reactive([
            {
                key: 1,
                label: 'Item 1',
                value: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ",
            },
            {
                key: 2,
                label: 'Item 2',
                value: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
            },
            {
                key: 3,
                label: 'Item 3',
                value: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
            },
        ]);
        const list = reactive([
            {
                name: 'task 1',
                tasks: [
                    {
                        name: 'task 2',
                    },
                ],
            },
            {
                name: 'task 3',
                tasks: [
                    {
                        name: 'task 4',
                    },
                ],
            },
            {
                name: 'task 5',
            },
            // {
            //     index: 1,
            //     items: [
            //         {
            //             title: 'item 1',
            //         },
            //     ],
            // },
            // {
            //     index: 2,
            //     items: [
            //         {
            //             title: 'item 2',
            //         },
            //         {
            //             title: 'item 3',
            //         },
            //     ],
            // },
        ]);

        const activeNames = ref([1]);
        const inputChanged = (val: any) => {
            activeNames.value = val;
        };

        const collapseComponentData = reactive({
            'onUpdate:modelValue': inputChanged,
            modelValue: activeNames,
        });

        return {
            indexDrap,
            indexDrap1,
            dataAccordionIcon,
            dataAccordion,
            activeNames,
            inputChanged,
            collapseComponentData,
            list,
        };
    },
});
</script>

<style lang="scss">
.accordion-component__item,
.accordion-drap-drop__item {
    max-width: 460px;
}
</style>
