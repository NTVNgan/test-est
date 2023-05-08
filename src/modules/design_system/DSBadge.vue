<template>
    <div class="ds-badge p-12p">
        <label class="block text-24 font-bold text-gray-700 mb-4p text-center">Notifications</label>
        <div class="grid grid-flow-col grid-cols-2 mb-16p">
            <div class="primary border-r-2">
                <label for="type" class="block text-14 font-bold text-gray-700 mb-16p text-center">Primary</label>
                <div class="grid grid-flow-col grid-cols-2 mb-16p">
                    <label class="ml-32p">from 1 to 9</label>
                    <badge-notification :count="9" />
                </div>
                <div class="grid grid-flow-col grid-cols-2 mb-16p">
                    <label class="ml-32p">from 10 to 99</label>
                    <badge-notification :count="99" />
                </div>
                <div class="grid grid-flow-col grid-cols-2 mb-16p">
                    <label class="ml-32p">over 99</label>
                    <badge-notification :count="100" />
                </div>
            </div>
            <div class="secondary">
                <label for="type" class="block text-14 font-bold text-gray-700 mb-16p text-center">Secondary</label>
                <div class="grid grid-flow-col grid-cols-2 mb-16p">
                    <label class="ml-32p">from 1 to 9</label>
                    <badge-notification type="secondary" :count="9" />
                </div>
                <div class="grid grid-flow-col grid-cols-2 mb-16p">
                    <label class="ml-32p">from 10 to 99</label>
                    <badge-notification type="secondary" :count="99" />
                </div>
                <div class="grid grid-flow-col grid-cols-2 mb-16p">
                    <label class="ml-32p">over 99</label>
                    <badge-notification type="secondary" :count="100" />
                </div>
            </div>
        </div>
        <label class="block text-24 font-bold text-gray-700 mb-4p text-center">Chip</label>
        <div class="grid grid-flow-col grid-cols-3 mb-16p">
            <div class="basic border-r-2">
                <label for="type" class="block text-14 font-bold text-gray-700 mb-16p text-center">Basic</label>
                <badge-chip class="mb-24p" status="neutral" content="neutral" background="#ffffff" />
                <badge-chip class="mb-24p" status="info" content="Information" background="#ffffff" />
                <badge-chip class="mb-24p" status="success" content="Success" background="#ffffff" />
                <badge-chip class="mb-24p" status="warning" content="Warning" background="#ffffff" />
                <badge-chip status="critical" content="Critical" background="#ffffff" />
            </div>
            <div class="basic border-r-2 pl-10p">
                <label for="type" class="block text-14 font-bold text-gray-700 mb-16p text-center">Outline</label>
                <badge-chip class="mb-24p" status="neutral" content="neutral" />
                <badge-chip class="mb-24p" status="info" content="Information" />
                <badge-chip class="mb-24p" status="success" content="Success" />
                <badge-chip class="mb-24p" status="warning" content="Warning" />
                <badge-chip status="critical" content="Critical" />
            </div>
            <div class="basic pl-10p">
                <label for="type" class="block text-14 font-bold text-gray-700 mb-16p text-center">With pip</label>
                <badge-chip class="mb-24p" status="neutral" content="neutral" type="pip" background="#ffffff" />
                <badge-chip class="mb-24p" status="info" content="Information" type="pip" background="#ffffff" />
                <badge-chip class="mb-24p" status="success" content="Success" type="pip" background="#ffffff" />
                <badge-chip class="mb-24p" status="warning" content="Warning" type="pip" background="#ffffff" />
                <badge-chip status="critical" content="Critical" type="pip" background="#ffffff" />
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import BadgeNotification from '@/components/ui/BadgeNotificationComponent.vue';
import BadgeChip from '@/components/ui/BadgeChipComponent.vue';

export default defineComponent({
    name: 'Badge Component',
    components: {
        BadgeNotification,
        BadgeChip,
    },
});
</script>
