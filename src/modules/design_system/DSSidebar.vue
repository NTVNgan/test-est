<template>
    <div class="p-20p flex">
        <SidebarComponent :navLink="sidebarNav1" class="h-600 mr-20p" />
        <SidebarComponent :navLink="sidebarNav2" class="h-600 mx-20p" />
        <SidebarComponent :navLink="sidebarNav3" class="h-600 mx-20p" />
        <SidebarComponent :navLink="sidebarNav4" class="h-600 mx-20p" />
        <SidebarComponent :navLink="sidebarNav5" class="h-600 mx-20p" />
        <SidebarComponent :navLink="sidebarNav6" class="h-600 mx-20p" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SidebarComponent from '@/components/ui/SidebarComponent.vue';
export default defineComponent({
    components: {
        SidebarComponent,
    },
    setup() {
        const sidebarNav1 = ref([
            {
                label: 'Inbox',
                name: 'Sidebar',
                icon: 'Inbox',
            },
            {
                label: 'Contacts',
                name: 'ContactSample',
                icon: 'Person',
            },
            {
                label: 'Articles',
                name: 'ArticleSample',
                icon: 'Book',
            },
            {
                label: 'Reports',
                name: 'ReportSample',
                icon: 'Chart',
            },
            {
                label: 'Outbound',
                name: 'OutboundSample',
                icon: 'PaperPlant',
            },
            {
                label: 'Setting',
                name: 'SettingSample',
                icon: 'Cog',
            },
        ]);
        const sidebarNav2 = ref([
            {
                label: 'Inbox',
                name: 'InboxSample',
                icon: 'Inbox',
            },
            {
                label: 'Contacts',
                name: 'Sidebar',
                icon: 'Person',
            },
            {
                label: 'Articles',
                name: 'ArticleSample',
                icon: 'Book',
            },
            {
                label: 'Reports',
                name: 'ReportSample',
                icon: 'Chart',
            },
            {
                label: 'Outbound',
                name: 'OutboundSample',
                icon: 'PaperPlant',
            },
            {
                label: 'Setting',
                name: 'SettingSample',
                icon: 'Cog',
            },
        ]);
        const sidebarNav3 = ref([
            {
                label: 'Inbox',
                name: 'InboxSample',
                icon: 'Inbox',
            },
            {
                label: 'Contacts',
                name: 'ContactSample',
                icon: 'Person',
            },
            {
                label: 'Articles',
                name: 'Sidebar',
                icon: 'Book',
            },
            {
                label: 'Reports',
                name: 'ReportSample',
                icon: 'Chart',
            },
            {
                label: 'Outbound',
                name: 'OutboundSample',
                icon: 'PaperPlant',
            },
            {
                label: 'Setting',
                name: 'SettingSample',
                icon: 'Cog',
            },
        ]);
        const sidebarNav4 = ref([
            {
                label: 'Inbox',
                name: 'InboxSample',
                icon: 'Inbox',
            },
            {
                label: 'Contacts',
                name: 'ContactSample',
                icon: 'Person',
            },
            {
                label: 'Articles',
                name: 'ArticleSample',
                icon: 'Book',
            },
            {
                label: 'Reports',
                name: 'Sidebar',
                icon: 'Chart',
            },
            {
                label: 'Outbound',
                name: 'OutboundSample',
                icon: 'PaperPlant',
            },
            {
                label: 'Setting',
                name: 'SettingSample',
                icon: 'Cog',
            },
        ]);
        const sidebarNav5 = ref([
            {
                label: 'Inbox',
                name: 'InboxSample',
                icon: 'Inbox',
            },
            {
                label: 'Contacts',
                name: 'ContactSample',
                icon: 'Person',
            },
            {
                label: 'Articles',
                name: 'ArticleSample',
                icon: 'Book',
            },
            {
                label: 'Reports',
                name: 'ReportSample',
                icon: 'Chart',
            },
            {
                label: 'Outbound',
                name: 'Sidebar',
                icon: 'PaperPlant',
            },
            {
                label: 'Setting',
                name: 'SettingSample',
                icon: 'Cog',
            },
        ]);
        const sidebarNav6 = ref([
            {
                label: 'Inbox',
                name: 'InboxSample',
                icon: 'Inbox',
            },
            {
                label: 'Contacts',
                name: 'ContactSample',
                icon: 'Person',
            },
            {
                label: 'Articles',
                name: 'ArticleSample',
                icon: 'Book',
            },
            {
                label: 'Reports',
                name: 'ReportSample',
                icon: 'Chart',
            },
            {
                label: 'Outbound',
                name: 'OutboundSample',
                icon: 'PaperPlant',
            },
            {
                label: 'Setting',
                name: 'Sidebar',
                icon: 'Cog',
            },
        ]);
        return {
            sidebarNav1,
            sidebarNav2,
            sidebarNav3,
            sidebarNav4,
            sidebarNav5,
            sidebarNav6,
        };
    },
});
</script>
