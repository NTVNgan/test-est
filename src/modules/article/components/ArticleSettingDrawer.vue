<template>
    <button-component
        class="ml-8p w-104 h-36 pr-4p btn-visibility"
        type="outline"
        icon="tools"
        positionIcon="left"
        @click="showSettingDrawer = true"
    >
        <span>Setting</span>
    </button-component>
    <drawer-component v-model="showSettingDrawer">
        <template #header>
            <div class="flex items-center">
                <icon-component class="mr-4p" name="tools" color="primary-500" />
                <span class="text-primary-500"> Article Settings </span>
            </div>
        </template>
        <template #body>
            <div>
                <div class="flex flex-col mb-24p">
                    <span class="text-14 font-medium mb-4p">Collection</span>
                    <select-component
                        class="w-288"
                        v-model="collectionSync"
                        maxHeightList="148px"
                        heightList="148px"
                        placeholder="Select"
                        @change="onChangeCollection"
                        showSearch
                        :isEmpty="collections && collections.length == 0"
                    >
                        <template v-if="collections!==null">
                            <SelectPanel v-for="(item, index) in collections" :key="index" :value="item._id">{{
                                item.name
                            }}</SelectPanel>
                        </template>
                        <template #empty> No collection have been created yet. </template>
                    </select-component>
                </div>
                <div v-if="collectionSync">
                    <span class="text-14 font-medium mb-4p">Section</span>
                    <select-component
                        class="w-288"
                        v-model="sectionSync"
                        maxHeightList="148px"
                        heightList="148px"
                        placeholder="Select"
                        @change="onChangeSection"
                    >
                        <SelectPanel v-for="(item, index) in sections" :key="index" :value="item._id">{{
                            item.name
                        }}</SelectPanel>
                    </select-component>
                </div>
            </div>
        </template>
    </drawer-component>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue';
import DrawerComponent from '@/components/ui/DrawerComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import SelectComponent from '@/components/ui/SelectComponent.vue';
import SelectPanel from '@/components/ui/SelectPanel.vue';
import { useArticle } from '../composables/useArticle';

export default {
    name: 'ArticleSettingDrawer',
    components: {
        DrawerComponent,
        ButtonComponent,
        SelectPanel,
        SelectComponent,
        IconComponent,
    },
    props: {
        collection: {
            type: String,
            default: null,
        },
        section: {
            type: String,
            default: null,
        },
    },
    // emits: ['update:collection', 'update:section'],
    setup(props: any, { emit }: any) {
        const { getCollections, getSectionByCollection } = useArticle();

        const showSettingDrawer = ref<boolean>(false);
        const collections = ref<any>([]);
        const sections = ref<any>([]);

        const sectionSync = computed({
            get(): string {
                return props.section;
            },
            set(value: string) {
                emit('update:section', value);
            },
        });

        const collectionSync = computed({
            get(): string {
                return props.collection;
            },
            set(value: string) {
                emit('update:collection', value);
            },
        });

        const onChangeCollection = (value: string) => {
            console.log('change collection', value);
        };

        const onChangeSection = (value: string) => {
            console.log('change section', value);
        };

        const onGetCollections = async () => {
            const limit = 100;
            const { data } = await getCollections({ limit });
            collections.value = data;
        };

        const onGetSections = async (collection_id: string) => {
            if (collection_id) {
                const limit = 100;
                const { data } = await getSectionByCollection({ limit, collection_id });
                sections.value = data;
            }
        };

        onGetCollections();

        onGetSections(props.collection);

        watch(
            () => props.collection,
            async (newVal, oldVal) => {
                if (newVal && newVal !== oldVal) {
                    await onGetSections(collectionSync.value);
                }
                if (!newVal && oldVal) {
                    emit('update:section', null);
                }
            },
        );

        return {
            onChangeCollection,
            onChangeSection,
            showSettingDrawer,
            sectionSync,
            collectionSync,
            collections,
            sections,
            onGetCollections,
        };
    },
};
</script>

<style>
</style>