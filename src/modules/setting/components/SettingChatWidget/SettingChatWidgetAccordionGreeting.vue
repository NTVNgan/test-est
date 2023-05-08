<template>
    <div class="flex">
        <div class="w-180 border-r border-neutrals-100">
            <div class="flex items-center justify-between pr-16p">
                <p class="text-14 font-bold">Languages</p>
                <tooltip-component
                    class="inline-flex text-neutrals-400"
                    size="small"
                    type="dark"
                    position="top"
                    content="Add language"
                >
                    <new-dropdown-component
                        v-model="showLanguageList"
                        width="204px"
                        position="bottom-right"
                        :paddingRange="4"
                        borderRadiusContent="4px"
                    >
                        <button-component
                            size="small"
                            type="secondary"
                            :class="{ 'button__add--focus': showLanguageList }"
                        >
                            Add
                        </button-component>
                        <template #content>
                            <list-component
                                showSearch
                                heightList="188px"
                                placeholderSearch="Search language"
                                v-model="languageAdd"
                                class="font-body"
                            >
                                <list-item-component v-for="item in listLanguageAvailable" :key="item" :value="item">
                                    {{ item.name }}
                                </list-item-component>
                            </list-component>
                        </template>
                    </new-dropdown-component>
                </tooltip-component>
            </div>
            <list-component
                ref="languageListSelected"
                class="mt-24p language-list--selected"
                :class="{ 'pr-16p': !isShowScrollbar }"
                v-model="languageSelectedIndex"
                heightList="316px"
            >
                <list-item-component
                    v-for="(item, index) in widgetSettingDataSync.welcome_message"
                    :key="'language-' + item"
                    :value="index"
                >
                    {{ item.language_name }} {{ item.default ? '(Default)' : '' }}
                </list-item-component>
            </list-component>
        </div>
        <div class="pl-16p min-w-0 flex-1">
            <div class="flex items-center justify-between">
                <p class="text-14 font-bold">
                    {{ widgetSettingDataSync.welcome_message[languageSelectedIndex].language_name }}
                    {{ widgetSettingDataSync.welcome_message[languageSelectedIndex].default ? '(Default)' : '' }}
                </p>
                <tooltip-component
                    class="inline-flex text-neutrals-400"
                    size="small"
                    type="dark"
                    position="top"
                    content="Delete language"
                >
                    <button-component
                        size="small"
                        type="outline"
                        icon="trash"
                        :disabled="
                            showLanguageList || widgetSettingDataSync.welcome_message[languageSelectedIndex].default
                        "
                        @click="removeLanguage(languageSelectedIndex)"
                    >
                    </button-component>
                </tooltip-component>
            </div>
            <div class="mt-24p">
                <input-tiptap-component
                    class="w-full mb-16p"
                    label="Greeting"
                    v-model:modelValue="widgetSettingDataSync.welcome_message[languageSelectedIndex].greating"
                    counter
                    height="76px"
                    preventEnter
                    :maxlength="100"
                    placeholder="Say hi to your customer"
                    :variantList="varriantListGreeting"
                >
                </input-tiptap-component>
                <input-tiptap-component
                    class="w-full mb-16p"
                    label="Team intro"
                    v-model:modelValue="widgetSettingDataSync.welcome_message[languageSelectedIndex].team_intro"
                    counter
                    height="140px"
                    :maxlength="200"
                    placeholder="Write something about your team"
                    :variantList="varriantListIntro"
                >
                </input-tiptap-component>
            </div>
            <button-component
                size="small"
                type="outline"
                :disabled="widgetSettingDataSync.welcome_message[languageSelectedIndex].default"
                @click="setDefaultLanguage(languageSelectedIndex)"
            >
                Set as default
            </button-component>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, ref, watch, onMounted, inject, nextTick } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import NewDropdownComponent from '@/components/ui/NewDropdownComponent.vue';
import ListComponent from '@/components/ui/ListComponent.vue';
import ListItemComponent from '@/components/ui/ListItemComponent.vue';
import InputTiptapComponent from '@/components/ui/InputTiptapComponent.vue';
import { useCountriesList } from '@/composables/useCountriesList';
import { useContact } from '@/modules/contact/composables/useContact';
import { useI18n } from 'vue-i18n';

export default {
    name: 'SettingChatWidgetAccordionGreeting',
    components: {
        ButtonComponent,
        TooltipComponent,
        NewDropdownComponent,
        ListComponent,
        ListItemComponent,
        InputTiptapComponent,
    },
    props: {
        widgetSettingData: {
            type: Object,
            default: null,
        },
    },
    emits: ['update:widgetSettingData'],
    setup(props: any, { emit }: any) {
        const { languagesList } = useCountriesList();
        const { getAttributes } = useContact();
        const { t } = useI18n();
        const emitter: any = inject('emitter');

        const isShowScrollbar = ref<boolean>(false);
        const showLanguageList = ref<boolean>(false);
        const languageAdd = ref<any>(null);
        const languageSelectedIndex = ref<any>(0);
        const languageDefault = ref<string>('');
        const attributes = ref<any>([]);
        const languageListSelected = ref<any>();
        const generalAttributes = [
            { name: t('contact.contact_list_table_title_fullname'), _id: 'full_name' },
            { name: t('contact.contact_list_table_title_email'), _id: 'email' },
            { name: t('contact.contact_list_table_title_phone'), _id: 'phone' },
            { name: t('contact.contact_list_table_title_country'), _id: 'country' },
            { name: t('contact.contact_list_table_title_signup'), _id: 'signed_up' },
            { name: t('contact.contact_list_table_title_lastseen'), _id: 'last_seen' },
            { name: t('contact.contact_list_table_title_local'), _id: 'timezone' },
            { name: t('contact.contact_list_table_title_city'), _id: 'city' },
            { name: t('contact.contact_list_table_title_customerid'), _id: 'hash_id' },
            { name: t('contact.contact_list_table_title_browserlang'), _id: 'browser_language' },
            { name: t('contact.contact_list_table_title_sessions'), _id: 'visit' },
            { name: t('contact.contact_list_table_title_firstseen'), _id: 'first_seen' },
            { name: t('contact.contact_list_table_title_os'), _id: 'os' },
            { name: t('contact.contact_list_table_title_browser'), _id: 'browser' },
            { name: t('contact.contact_list_table_title_browserversion'), _id: 'browser_version' },
        ];
        const orgAttributes = [
            { name: 'Organization name', _id: 'organization_name' },
            { name: 'Workspace name', _id: 'workspace_name' },
        ];

        const widgetSettingDataSync = computed({
            get(): any {
                return props.widgetSettingData;
            },
            set(value: any) {
                emit('update:widgetSettingData', value);
            },
        });
        const varriantListGreeting = computed(() =>
            [...generalAttributes, ...attributes.value].sort((a: any, b: any) => a.name.localeCompare(b.name)),
        );
        const varriantListIntro = computed(() =>
            [...generalAttributes, ...orgAttributes, ...attributes.value].sort((a: any, b: any) =>
                a.name.localeCompare(b.name),
            ),
        );
        const listLanguageAvailable = computed(() => {
            return languagesList.value
                .filter((lang: any) => {
                    const findIndex = widgetSettingDataSync.value.welcome_message.findIndex(
                        (item: any) => item.language_code === lang.key,
                    );
                    return findIndex === -1;
                })
                .sort((a: any, b: any) => a.name.localeCompare(b.name));
        });

        const checkShowScrollbarListSelected = async () => {
            await nextTick();
            if (languageListSelected.value) {
                isShowScrollbar.value =
                    languageListSelected.value.listComponent.scrollHeight >
                    languageListSelected.value.listComponent.clientHeight;
            }
        };
        const removeLanguage = (index: number) => {
            widgetSettingDataSync.value.welcome_message.splice(index, 1);
            checkShowScrollbarListSelected();
            emitter.emit('updateInputComponentTiptap');
            emitter.emit('updateIndexLanguage', languageSelectedIndex.value);
            if (index === widgetSettingDataSync.value.welcome_message.length) {
                languageSelectedIndex.value--;
            }
        };
        const setDefaultLanguage = (index_default: number) => {
            for (let index = 0; index < widgetSettingDataSync.value.welcome_message.length; index++) {
                const item = widgetSettingDataSync.value.welcome_message[index];
                item.default = index === index_default;
            }
        };

        const onGetAttributes = async () => {
            try {
                const data = await getAttributes({
                    page: 1,
                    limit: 200,
                    show: 1,
                });
                attributes.value = data.data;
                Promise.resolve();
            } catch (e) {
                console.log({ e });
            }
        };

        watch(
            () => languageAdd.value,
            async (newVal: any) => {
                const languageData = {
                    default: false,
                    greating: '',
                    language_code: newVal.key,
                    language_name: newVal.name,
                    team_intro: '',
                };
                widgetSettingDataSync.value.welcome_message.push(languageData);
                widgetSettingDataSync.value.welcome_message.sort((a: any, b: any) => a.language_name.localeCompare(b.language_name)),
                    checkShowScrollbarListSelected();
                await nextTick();
                emitter.emit('updateInputComponentTiptap');
                emitter.emit('updateIndexLanguage', languageSelectedIndex.value);
                const findIndex = widgetSettingDataSync.value.welcome_message.findIndex((item: any) => item.language_code === newVal.key);
                languageSelectedIndex.value = findIndex;
                showLanguageList.value = false;
            },
            { deep: true },
        );
        watch(
            () => languageSelectedIndex.value,
            () => {
                emitter.emit('updateInputComponentTiptap');
                emitter.emit('updateIndexLanguage', languageSelectedIndex.value);
            },
            { deep: true },
        );

        onMounted(async () => {
            await onGetAttributes();
                emitter.emit('updateIndexLanguage', languageSelectedIndex.value);
        });
        return {
            widgetSettingDataSync,
            languagesList,
            showLanguageList,
            languageSelectedIndex,
            varriantListGreeting,
            varriantListIntro,
            attributes,
            languageDefault,
            setDefaultLanguage,
            listLanguageAvailable,
            languageAdd,
            removeLanguage,
            languageListSelected,
            isShowScrollbar,
        };
    },
};
</script>

<style lang="scss" scoped>
.language-list--selected {
    :deep(.scrollbar--transparent.overflow-y-auto) {
        padding: 0;
    }
}
.button__add--focus {
    border-color: #3e6dda;
    background: #fff;
}
</style>
