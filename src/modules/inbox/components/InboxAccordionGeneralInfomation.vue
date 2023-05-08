<template>
    <div class="text-14 px-8p py-16p cursor-default">
        <div class="grid grid-cols-2 text-14 px-8p py-4p">
            <Tooltip
                style="display: block"
                class="pr-4p text-neutrals-400"
                size="small"
                type="light"
                position="top"
                showByTruncate
                :timeout="1000"
                :content="$t('inbox.inbox_general_info_browser')"
            >
                <div class="truncate block w-full">
                    <span>{{ $t('inbox.inbox_general_info_browser') }}</span>
                </div>
            </Tooltip>
            <Tooltip
                style="display: block"
                class="pl-4p"
                size="small"
                type="light"
                position="top"
                showByTruncate
                :timeout="1000"
                :content="browser ? browser : $t('inbox.inbox_text_unknown')"
            >
                <span class="truncate block w-full">
                    {{ browser ? browser : $t('inbox.inbox_text_unknown') }}
                </span>
            </Tooltip>
        </div>
        <div class="grid grid-cols-2 text-14 px-8p py-4p">
            <Tooltip
                class="pr-4p text-neutrals-400"
                size="small"
                type="light"
                position="top"
                showByTruncate
                :timeout="1000"
                :content="$t('inbox.inbox_general_info_sessions')"
            >
                <span class="truncate block w-full">
                    {{ $t('inbox.inbox_general_info_sessions') }}
                </span>
            </Tooltip>
            <Tooltip
                class="pl-4p"
                size="small"
                type="light"
                position="top"
                showByTruncate
                :timeout="1000"
                :content="contact.visit !== null ? contact.visit.toString() : $t('inbox.inbox_text_unknown')"
            >
                <span class="truncate block w-full">
                    {{ contact.visit !== null ? contact.visit : $t('inbox.inbox_text_unknown') }}
                </span>
            </Tooltip>
        </div>
        <div class="grid grid-cols-2 text-14 px-8p py-4p">
            <Tooltip
                class="pr-4p text-neutrals-400"
                size="small"
                type="light"
                position="top"
                showByTruncate
                :timeout="1000"
                :content="$t('inbox.inbox_general_info_first_seen')"
            >
                <span class="truncate block w-full">
                    {{ $t('inbox.inbox_general_info_first_seen') }}
                </span>
            </Tooltip>
            <Tooltip
                class="pl-4p"
                size="small"
                type="light"
                position="top"
                showByTruncate
                :timeout="1000"
                :content="contact.first_seen ? filters.formatTime(contact.first_seen) : $t('inbox.inbox_text_unknown')"
            >
                <span class="truncate block w-full">
                    {{ contact.first_seen ? filters.formatTime(contact.first_seen) : $t('inbox.inbox_text_unknown') }}
                </span>
            </Tooltip>
        </div>
        <div class="grid grid-cols-2 text-14 px-8p py-4p">
            <Tooltip
                class="pr-4p text-neutrals-400"
                size="small"
                type="light"
                position="top"
                showByTruncate
                :timeout="1000"
                :content="$t('inbox.inbox_general_info_last_seen')"
            >
                <span class="truncate block w-full">
                    {{ $t('inbox.inbox_general_info_last_seen') }}
                </span>
            </Tooltip>
            <Tooltip
                class="pl-4p"
                size="small"
                type="light"
                position="top"
                showByTruncate
                :timeout="1000"
                :content="contact.last_seen ? filters.formatTime(contact.last_seen) : $t('inbox.inbox_text_unknown')"
            >
                <span class="truncate block w-full">
                    {{ contact.last_seen ? filters.formatTime(contact.last_seen) : $t('inbox.inbox_text_unknown') }}
                </span>
            </Tooltip>
        </div>
        <div class="grid grid-cols-2 text-14 px-8p py-4p">
            <Tooltip
                class="pr-4p text-neutrals-400"
                size="small"
                type="light"
                position="top"
                showByTruncate
                :timeout="1000"
                :content="$t('inbox.inbox_general_info_signup')"
            >
                <span class="truncate block w-full">
                    {{ $t('inbox.inbox_general_info_signup') }}
                </span>
            </Tooltip>
            <Tooltip
                class="pl-4p"
                size="small"
                type="light"
                position="top"
                showByTruncate
                :timeout="1000"
                :content="contact.signed_up ? filters.formatTime(contact.signed_up) : $t('inbox.inbox_text_unknown')"
            >
                <span class="truncate block w-full">
                    {{ contact.signed_up ? filters.formatTime(contact.signed_up) : $t('inbox.inbox_text_unknown') }}
                </span>
            </Tooltip>
        </div>
        <div class="grid grid-cols-2 text-14 px-8p py-4p">
            <Tooltip
                class="pr-4p text-neutrals-400"
                size="small"
                type="light"
                position="top"
                showByTruncate
                :timeout="1000"
                :content="$t('inbox.inbox_general_info_os')"
            >
                <span class="truncate block w-full">
                    {{ $t('inbox.inbox_general_info_os') }}
                </span>
            </Tooltip>
            <Tooltip
                class="pl-4p"
                size="small"
                type="light"
                position="top"
                showByTruncate
                :timeout="1000"
                :content="
                    contact.os
                        ? `${contact.os.name} ${contact.os.version} ${contact.os.platform}`
                        : $t('inbox.inbox_text_unknown')
                "
            >
                <span class="truncate block w-full">
                    {{
                        contact.os
                            ? `${contact.os.name} ${contact.os.version} ${contact.os.platform}`
                            : $t('inbox.inbox_text_unknown')
                    }}
                </span>
            </Tooltip>
        </div>
        <div class="grid grid-cols-2 text-14 px-8p py-4p">
            <Tooltip
                class="pr-4p text-neutrals-400"
                size="small"
                type="light"
                position="top"
                showByTruncate
                :timeout="1000"
                :content="$t('inbox.inbox_general_info_browser_language')"
            >
                <span class="truncate block w-full">
                    {{ $t('inbox.inbox_general_info_browser_language') }}
                </span>
            </Tooltip>
            <Tooltip
                class="pl-4p"
                size="small"
                type="light"
                position="top"
                showByTruncate
                :timeout="1000"
                :content="
                    contact.browser_language
                        ? getLanguagesName(contact.browser_language)
                        : $t('inbox.inbox_text_unknown')
                "
            >
                <span class="truncate block w-full">
                    {{
                        contact.browser_language
                            ? getLanguagesName(contact.browser_language)
                            : $t('inbox.inbox_text_unknown')
                    }}
                </span>
            </Tooltip>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import Tooltip from '@/components/ui/TooltipComponent.vue';
import { useContact } from '@/modules/contact/composables/useContact';
import filters from '@/utils/filters';
import { useCountriesList } from '@/composables/useCountriesList';

export default defineComponent({
    name: 'InboxGeneralInfomation',
    components: {
        Tooltip,
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
