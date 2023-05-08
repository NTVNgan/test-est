<template>
    <div ref="cannedResponse" class="canned-response  h-full w-full relative">
        <template v-if="countCallAPI > 0">
            <h2 class="text-24 font-heading font-semibold py-24p px-40p">Canned Responses</h2>
            <tab-component
                class="canned-response-tab h-full"
                v-model="tab"
                :tabs="tabs"
                default-value="canned_responses"
                type="underline"
                @change="clickTab"
            >
                <div id="canned_responses" class="h-full">
                    <SettingCannedResponseList :tabCR="tabCR" :tabActive="tab"></SettingCannedResponseList>
                </div>
                <div id="categories">
                    <SettingCannedResponseCategories :tabActive="tab"/>
                </div>
            </tab-component>
        </template>
        <template v-else>
            <SettingCannedResponsePageSkeletonComponent />
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import TabComponent from '@/components/ui/TabComponent.vue';
import SettingCannedResponseList from '@/modules/setting/components/SettingCannedResponseList.vue';
import SettingCannedResponseCategories from '@/modules/setting/components/SettingCannedResponseCategories.vue';
import SettingCannedResponsePageSkeletonComponent from '@/modules/setting/components/SettingCannedResponsePageSkeletonComponent.vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
    name: 'SettingCannedResponses',
    components: {
        TabComponent,
        SettingCannedResponseList,
        SettingCannedResponseCategories,
        SettingCannedResponsePageSkeletonComponent,
    },
    setup() {
        const tab = ref<any>('canned_responses');
        const searchValue = ref<string>('');
        const status = ref<string>('init');
        const tabs = ref<any>([
            { key: 'canned_responses', name: 'Canned responses' },
            { key: 'categories', name: 'Categories' },
        ]);
        const countCallAPI = ref<number>(0);
        const tabCR = ref<number>(0);
        const router = useRouter();
        const route = useRoute();

        const clickTab = async (val: any) => {
            router.replace({ name: 'CannedResponses', query: { tab: val.key } });
            if (val.key === 'canned_responses') tabCR.value++;
        };

        const handleTab = async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            const queryData = router.currentRoute.value.query;
            if (queryData.tab) {
                tab.value = queryData.tab;
                if (tab.value == null) return;
                const tabcontent: any = document.getElementsByClassName('tab-content');
                if (tabcontent.length < 1) return;
                tabcontent[0].children.forEach((element: any) => {
                    element.style.display = 'none';
                });
                const tabContentId: any = document.getElementById(tab.value);
                tabContentId.style.display = 'block';
            }
        };

        onMounted(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            countCallAPI.value++;
        });

        watch(
            () => route.query,
            () => {
                handleTab();
            },
            { immediate: true },
        );

        return {
            tabs,
            tab,
            searchValue,
            status,
            countCallAPI,
            clickTab,
            tabCR,
        };
    },
});
</script>

<style lang="scss" scoped>
.canned-response {
    :deep(.canned-response-tab) {
        nav {
            position: relative;

            a {
                flex: initial;
                margin-right: 0;
                margin-left: 40px;
                position: relative;
                z-index: 1;
            }
            a.selected-tab {
                font-weight: 500;
            }
        }
        nav:after {
            content: '';
            display: block;
            position: absolute;
            bottom: 1px;
            height: 1px;
            left: 0;
            right: 0;
            background-color: #e0e0e0;
        }
    }
}
</style>
<style>
.canned-response-tab > div {
    height: 100%;
}
</style>
