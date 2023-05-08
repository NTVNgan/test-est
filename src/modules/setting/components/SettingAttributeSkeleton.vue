<template>
    <skeleton-box width="205px" />
    <div class="flex justify-between items-center mt-50p mb-48p">
        <div class="contact-attribute__search">
            <skeleton-box width="100%" />
        </div>
        <div class="contact-attribute__button">
            <skeleton-box width="100%" />
        </div>
        <div class="contact-attribute__button">
            <skeleton-box width="100%" />
        </div>
    </div>
    <skeleton-box width="112px" />
    <skeleton-box width="72px" class="mt-46p" />
    <div class="pt-22p">
        <SkeletonTable />
    </div>
</template>

<script lang="ts">
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import SkeletonTable from '../components/SettingAttributeSkeletonTable.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SettingAttributeSkeleton',
    components: {
        SkeletonBox,
        SkeletonTable
    },
});
</script>