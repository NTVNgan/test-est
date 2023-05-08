<template>
    <Card type="shadow" class="relative mb-32p">
        <div class="h-56 flex items-center justify-between px-24p py-16p">
            <p class="text-primary-500 text-16 font-bold">
                {{ $t('contact.contact_detail_customer_info_accordion_general_infomation') }}
            </p>
        </div>
        <div class="px-24p pb-24p">
            <div class="grid grid-cols-2 text-14 py-4p">
                <Tooltip
                    style="display: block"
                    class="pr-4p text-neutrals-400"
                    :class="{ 'text-neutrals-200': disableInfo }"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :timeout="1000"
                    :content="$t('contact.contact_detail_general_info_browser')"
                >
                    <div class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                        <span>{{ $t('contact.contact_detail_general_info_browser') }}</span>
                    </div>
                </Tooltip>
                <Tooltip
                    style="display: block"
                    class="pl-4p"
                    :class="{ 'text-neutrals-200': disableInfo }"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :timeout="1000"
                    :content="browser ? browser : $t('contact.contact_detail_text_unknown')"
                >
                    <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                        {{ browser ? browser : $t('contact.contact_detail_text_unknown') }}
                    </span>
                </Tooltip>
            </div>
            <div class="grid grid-cols-2 text-14 py-4p">
                <Tooltip
                    class="pr-4p text-neutrals-400"
                    :class="{ 'text-neutrals-200': disableInfo }"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :timeout="1000"
                    :content="$t('contact.contact_detail_general_info_sessions')"
                >
                    <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                        {{ $t('contact.contact_detail_general_info_sessions') }}
                    </span>
                </Tooltip>
                <Tooltip
                    class="pl-4p"
                    :class="{ 'text-neutrals-200': disableInfo }"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :timeout="1000"
                    :content="
                        contact.visit !== null ? contact.visit.toString() : $t('contact.contact_detail_text_unknown')
                    "
                >
                    <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                        {{ contact.visit !== null ? contact.visit : $t('contact.contact_detail_text_unknown') }}
                    </span>
                </Tooltip>
            </div>
            <div class="grid grid-cols-2 text-14 py-4p">
                <Tooltip
                    class="pr-4p text-neutrals-400"
                    :class="{ 'text-neutrals-200': disableInfo }"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :timeout="1000"
                    :content="$t('contact.contact_detail_general_info_first_seen')"
                >
                    <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                        {{ $t('contact.contact_detail_general_info_first_seen') }}
                    </span>
                </Tooltip>
                <Tooltip
                    class="pl-4p"
                    :class="{ 'text-neutrals-200': disableInfo }"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :timeout="1000"
                    :content="
                        contact.first_seen
                            ? filters.formatTime(contact.first_seen)
                            : $t('contact.contact_detail_text_unknown')
                    "
                >
                    <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                        {{
                            contact.first_seen
                                ? filters.formatTime(contact.first_seen)
                                : $t('contact.contact_detail_text_unknown')
                        }}
                    </span>
                </Tooltip>
            </div>
            <div class="grid grid-cols-2 text-14 py-4p">
                <Tooltip
                    class="pr-4p text-neutrals-400"
                    :class="{ 'text-neutrals-200': disableInfo }"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :timeout="1000"
                    :content="$t('contact.contact_detail_general_info_last_seen')"
                >
                    <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                        {{ $t('contact.contact_detail_general_info_last_seen') }}
                    </span>
                </Tooltip>
                <Tooltip
                    class="pl-4p"
                    :class="{ 'text-neutrals-200': disableInfo }"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :timeout="1000"
                    :content="
                        contact.last_seen
                            ? filters.formatTime(contact.last_seen)
                            : $t('contact.contact_detail_text_unknown')
                    "
                >
                    <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                        {{
                            contact.last_seen
                                ? filters.formatTime(contact.last_seen)
                                : $t('contact.contact_detail_text_unknown')
                        }}
                    </span>
                </Tooltip>
            </div>
            <div class="grid grid-cols-2 text-14 py-4p">
                <Tooltip
                    class="pr-4p text-neutrals-400"
                    :class="{ 'text-neutrals-200': disableInfo }"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :timeout="1000"
                    :content="$t('contact.contact_detail_general_info_signup')"
                >
                    <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                        {{ $t('contact.contact_detail_general_info_signup') }}
                    </span>
                </Tooltip>
                <Tooltip
                    class="pl-4p"
                    :class="{ 'text-neutrals-200': disableInfo }"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :timeout="1000"
                    :content="
                        contact.signed_up
                            ? filters.formatTime(contact.signed_up)
                            : $t('contact.contact_detail_text_unknown')
                    "
                >
                    <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                        {{
                            contact.signed_up
                                ? filters.formatTime(contact.signed_up)
                                : $t('contact.contact_detail_text_unknown')
                        }}
                    </span>
                </Tooltip>
            </div>
            <div class="grid grid-cols-2 text-14 py-4p">
                <Tooltip
                    class="pr-4p text-neutrals-400"
                    :class="{ 'text-neutrals-200': disableInfo }"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :timeout="1000"
                    :content="$t('contact.contact_detail_general_info_os')"
                >
                    <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                        {{ $t('contact.contact_detail_general_info_os') }}
                    </span>
                </Tooltip>
                <Tooltip
                    class="pl-4p"
                    :class="{ 'text-neutrals-200': disableInfo }"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :timeout="1000"
                    :content="
                        contact.os
                            ? `${contact.os.name} ${contact.os.version} ${contact.os.platform}`
                            : $t('contact.contact_detail_text_unknown')
                    "
                >
                    <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                        {{
                            contact.os
                                ? `${contact.os.name} ${contact.os.version} ${contact.os.platform}`
                                : $t('contact.contact_detail_text_unknown')
                        }}
                    </span>
                </Tooltip>
            </div>
            <div class="grid grid-cols-2 text-14 py-4p">
                <Tooltip
                    class="pr-4p text-neutrals-400"
                    :class="{ 'text-neutrals-200': disableInfo }"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :timeout="1000"
                    :content="$t('contact.contact_detail_general_info_browser_language')"
                >
                    <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                        {{ $t('contact.contact_detail_general_info_browser_language') }}
                    </span>
                </Tooltip>
                <Tooltip
                    class="pl-4p"
                    :class="{ 'text-neutrals-200': disableInfo }"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :timeout="1000"
                    :content="
                        contact.browser_language
                            ? getLanguagesName(contact.browser_language)
                            : $t('contact.contact_detail_text_unknown')
                    "
                >
                    <span class="truncate block w-full" :class="{ 'text-neutrals-200': disableInfo }">
                        {{
                            contact.browser_language
                                ? getLanguagesName(contact.browser_language)
                                : $t('contact.contact_detail_text_unknown')
                        }}
                    </span>
                </Tooltip>
            </div>
        </div>
    </Card>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import Tooltip from '@/components/ui/TooltipComponent.vue';
import Card from '@/components/ui/CardComponent.vue';
import { useContact } from '@/modules/contact/composables/useContact';
import filters from '@/utils/filters';
import { useCountriesList } from '@/composables/useCountriesList';

export default defineComponent({
    name: 'ContactDetailGeneralInfomation',
    components: {
        Card,
        Tooltip,
    },
    props: {
        disableInfo: {
            type: Boolean,
            default: false,
        },
    },
    setup() {
        const { getLanguagesName } = useCountriesList();
        const { contact } = useContact();
        const browser = computed(() => {
            if (contact.value.browser && contact.value.browser_version)
                return `${contact.value.browser} ${contact.value.browser_version}`;
            return null;
        });
        return {
            contact,
            browser,
            filters,
            getLanguagesName,
        };
    },
});
</script>
