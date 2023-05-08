<template>
    <div class="p-20p flex">
        <submenu-component
            class="mr-20p"
            style="height: 600px"
            heading="Inbox"
            :navLink="SampleLink1"
            :showCount="true"
        />
        <submenu-component class="mx-20p" style="height: 600px" heading="Inbox" :navLink="SampleLink2" />
        <submenu-component class="ml-20p" style="height: 600px" heading="Inbox" :navLink="SampleLink3" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SubmenuComponent from '@/components/ui/SubmenuComponent.vue';
export default defineComponent({
    components: {
        SubmenuComponent,
    },
    setup() {
        const SampleLink1 = ref([
            {
                label: 'Assign to you',
                name: 'Submenu',
            },
            {
                label: 'Unassign',
                name: 'ProfileNotification',
            },
            {
                label: 'Very long long long text',
                name: 'InboxSample',
            },
        ]);
        const SampleLink2 = ref([
            {
                label: 'Account Details',
                name: 'Submenu',
            },
            {
                label: 'Notification',
                name: 'ProfileNotification',
            },
        ]);
        const SampleLink3 = ref([
            {
                label: 'Account Details',
                name: 'Submenu',
            },
            {
                label: 'Notification',
                name: 'ProfileNotification',
            },
            {
                label: 'Submenu',
                name: 'ProfileNotification',
            },
            {
                label: 'Submenu',
                name: 'ProfileNotification',
            },
            {
                label: 'Submenu',
                name: 'ProfileNotification',
            },
            {
                label: 'Submenu',
                name: 'ProfileNotification',
            },
            {
                label: 'Submenu',
                name: 'ProfileNotification',
            },
            {
                label: 'Submenu',
                name: 'ProfileNotification',
            },
            {
                label: 'Submenu',
                name: 'ProfileNotification',
            },
            {
                label: 'Submenu',
                name: 'ProfileNotification',
            },
            {
                label: 'Submenu',
                name: 'ProfileNotification',
            },
            {
                label: 'Submenu',
                name: 'ProfileNotification',
            },
            {
                label: 'Submenu',
                name: 'ProfileNotification',
            },
            {
                label: 'Submenu',
                name: 'ProfileNotification',
            },
            {
                label: 'Submenu',
                name: 'ProfileNotification',
            },
        ]);
        return {
            SampleLink1,
            SampleLink2,
            SampleLink3,
        };
    },
});
</script>
