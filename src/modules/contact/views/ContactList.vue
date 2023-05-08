<template>
    <div class="flex w-full contact-list">
        <submenu-component
            :loading="loadingSegments"
            @change="clickSubmenu"
            :showCount="true"
            heading="CONTACT"
            :navLinkParams="routeList"
            :linkWithParams="true"
            :numberComma="true"
        >
            <template v-slot:header-addon>
                <button-component
                    :key="compKey"
                    @click="onClickSearch"
                    :active="router.currentRoute.value.name === 'ContactListBySearch'"
                    type="subtle"
                    icon="search"
                />
            </template>
            <template v-slot:child-menu-addon>
                <ContactListSegmentCustom></ContactListSegmentCustom>
            </template>
        </submenu-component>
        <div class="h-full min-w-0 flex-1 flex bg-white shadow-deep-1 rounded-l-8p relative">
            <contact-list-skeleton v-if="status !== 'done'" />
            <router-view v-if="status === 'done'" />
        </div>
    </div>
</template>

<script lang="ts">
import SubmenuComponent from '@/components/ui/SubmenuComponent.vue';
import { useSegment } from '../composables/useSegment';
import { onMounted, ref, computed, provide, inject, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContact } from '../composables/useContact';
import { routerPush } from '@/router';
import ContactListSkeleton from '../components/ContactListSkeleton.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { useI18n } from 'vue-i18n';
import helper from '@/utils/helper';
import ContactListSegmentCustom from '../components/ContactListSegmentCustom.vue';
import { store } from '@/store';
import { useSocket } from '@/composables/useSocket';
import { useToast } from '@/composables/useToast';

export default {
    name: 'ContactList',
    components: {
        SubmenuComponent,
        ContactListSkeleton,
        ButtonComponent,
        ContactListSegmentCustom,
    },
    setup() {
        const { t } = useI18n();
        const generalAttributes = [
            { name: t('contact.contact_list_table_title_fullname'), _id: 'full_name', datatype: 1, disabled: true },
            { name: t('contact.contact_list_table_title_email'), _id: 'email', datatype: 1, disabled: true },
            { name: t('contact.contact_list_table_title_phone'), _id: 'phone', datatype: 1 },
            { name: t('contact.contact_list_table_title_country'), _id: 'country', datatype: 'select' },
            { name: t('contact.contact_list_table_title_signup'), _id: 'signed_up', datatype: 3 },
            { name: t('contact.contact_list_table_title_lastseen'), _id: 'last_seen', datatype: 3 },
            { name: t('contact.contact_list_table_title_local'), _id: 'timezone', datatype: 1 },
            { name: t('contact.contact_list_table_title_city'), _id: 'city', datatype: 1 },
            { name: t('contact.contact_list_table_title_customerid'), _id: 'hash_id', datatype: 1 },
            { name: t('contact.contact_list_table_title_browserlang'), _id: 'browser_language', datatype: 'select' },
            { name: t('contact.contact_list_table_title_sessions'), _id: 'visit', datatype: 5 },
            { name: t('contact.contact_list_table_title_firstseen'), _id: 'first_seen', datatype: 3 },
            { name: t('contact.contact_list_table_title_os'), _id: 'os', datatype: 1 },
            { name: t('contact.contact_list_table_title_browser'), _id: 'browser', datatype: 1 },
            { name: t('contact.contact_list_table_title_browserversion'), _id: 'browser_version', datatype: 1 },
        ];
        const {
            segments,
            loading: loadingSegments,
            error,
            errorMessage,
            getSegments,
            routeSegmentList: routeList,
            segmentsCustom,
            getCountSegmentCustom,
            getSegmentById,
        } = useSegment();
        const route = useRoute();
        const router = useRouter();
        const isSearch = ref<boolean>(false);
        const selectedSegment = ref<any>(null);
        const compKey = ref(0);
        const attributes = ref<any>([]); //Attribute động
        const attributesFilter = ref<any>([]); // map attr filter
        const { getContactsSetting, getAttributes } = useContact();
        const contactSettings = ref<any>(null);
        const status = ref('init');
        const statusLoadingContactSettings = ref('init');
        const statusLoadingContactAttributes = ref('init');
        const openDropdown = ref(false);
        const user = computed(() => store.state.auth.user);
        const { _id: user_id } = user.value;
        const { socket } = useSocket();
        const emitter: any = inject('emitter');
        const { addToast } = useToast();

        const attributesList = computed(() =>
            [...generalAttributes, ...attributes.value].sort((a: any, b: any) => a.name.localeCompare(b.name)),
        );
        const attributesFitlerList = computed(() =>
            [...generalAttributes, ...attributesFilter.value].sort((a: any, b: any) => a.name.localeCompare(b.name)),
        );

        const contactSettingExcludeHide = computed(() => {
            return contactSettings.value
                ? contactSettings.value.filter((item: string) => {
                      if (item.includes('attr')) {
                          return !!attributesList.value.find((attrItem) => item.replace('attr_', '') === attrItem._id);
                      } else return true;
                  })
                : [];
        });

        provide('selectedSegment', selectedSegment);

        provide('attributes', { list: attributesList, status: statusLoadingContactAttributes });

        provide('attributesFilter', { list: attributesFitlerList, status: statusLoadingContactAttributes });

        provide('contactSetting', { list: contactSettings, status: statusLoadingContactSettings });

        provide('statusInitContactListData', status);

        const onGetContactSetting = async () => {
            const data = await getContactsSetting();
            contactSettings.value = data;
            statusLoadingContactSettings.value = 'done';
        };

        const pushCurrentRoute = async () => {
            if ((route.name == 'ContactListBySegment' || route.name == 'ContactList') && segments.value.length !== 0) {
                console.log(route.query, 'route');
                if (!route.params.segmentId) {
                    selectedSegment.value = segments.value.find((item) => item.name === 'All');
                    router.replace({
                        name: 'ContactListBySegment',
                        params: {
                            segmentId: selectedSegment.value['_id'],
                        },
                        query: route.query,
                    });
                } else if (route.params.segmentId) {
                    const segmentAll = [...segments.value, ...segmentsCustom.value];
                    const value: any = segmentAll.find((item: any) => {
                        return item._id === route.params.segmentId;
                    });
                    if (value) {
                        selectedSegment.value = helper.clone(value);
                        router.replace({
                            name: 'ContactListBySegment',
                            params: {
                                segmentId: selectedSegment.value['_id'],
                            },
                            query: route.query,
                        });
                    } else {
                        const segmentById = await getSegmentById(route.params.segmentId);
                        if (segmentById) {
                            if (segmentById.hide_for_users.includes(user_id)) {
                                const findSegment = segments.value.find((s) => s.name === 'All');
                                let selectSegment = { _id: '' };
                                if (findSegment) selectSegment = findSegment;
                                if (segmentsCustom.value.length > 0) selectSegment = segmentsCustom.value[0];
                                await router.replace({
                                    name: 'ContactListBySegment',
                                    params: {
                                        segmentId: selectSegment._id,
                                    },
                                    query: route.query,
                                });
                            } else {
                                selectedSegment.value = helper.clone(segmentById);
                                router.replace({
                                    name: 'ContactListBySegment',
                                    params: {
                                        segmentId: selectedSegment.value['_id'],
                                    },
                                    query: route.query,
                                });
                            }
                        } else routerPush('Error404');
                    }
                }
            }
        };

        const onGetSegments = async () => {
            await getSegments();
            await pushCurrentRoute();
            Promise.resolve();
        };

        const onGetAttributes = async () => {
            try {
                const data = await getAttributes({
                    page: 1,
                    limit: 200,
                    show: 1,
                });
                attributes.value = data.data;
                attributesFilter.value = data.data.map((item: any) => {
                    const temp = Object.assign({}, item);
                    temp._id = `attr_${item._id}`;
                    return temp;
                });
                statusLoadingContactAttributes.value = 'done';
                Promise.resolve();
            } catch (e) {
                console.log({ e });
            }
        };

        const clickSubmenu = (item: any) => {
            //TODO: CHANGE SELECTED SEGMENT
            isSearch.value = false;
        };

        const onClickSearch = () => {
            isSearch.value = !isSearch.value;
            if (route.name !== 'ContactListBySearch') {
                routerPush('ContactListBySearch');
            } else router.go(-1);
        };

        const updateShowHideSegment = (data: any) => {
            console.log('data', data);
        };

        onMounted(async () => {
            status.value = 'loading';
            await onGetContactSetting();
            await onGetAttributes();
            await onGetSegments();
            await getCountSegmentCustom();
            contactSettings.value = contactSettings.value.filter((item: string) => {
                if (item.includes('attr')) {
                    return !!attributesList.value.find((attrItem) => item.replace('attr_', '') === attrItem._id);
                } else return true;
            });
            status.value = 'done';
        });

        watch(router.currentRoute, (value) => {
            if (value.name === 'ContactListBySegment') {
                const btn = document.getElementById('button-compo');
                if (btn != null) {
                    btn.focus();
                }
            }
            pushCurrentRoute();
        });

        return {
            clickSubmenu,
            routeList,
            isSearch,
            onClickSearch,
            selectedSegment,
            loadingSegments,
            route,
            compKey,
            attributesList,
            attributesFilter,
            status,
            segments,
            router,
            openDropdown,
            updateShowHideSegment,
            contactSettings,
            contactSettingExcludeHide,
            // arrAttributeHide
        };
    },
};
</script>
<style scoped>
.contact-list :deep(.submenu__wrapper) {
    height: auto;
    flex: inherit;
    margin-bottom: 36px;
}

.contact-list :deep(.footer-submenu) {
    height: calc(100vh - 53px - 193px - 72px - 32px - 20px);
}
</style>
