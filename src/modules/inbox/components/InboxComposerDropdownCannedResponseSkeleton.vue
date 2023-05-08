<template>
    <div class="w-232 h-full py-8p pl-8p">
        <div class="px-12p py-16p" v-for="index in 4" :key="index">
            <skeleton-box
                class="mb-8p"
                width="80px"
                :classBgColor="index % 2 === 0 ? 'bg-neutrals-100' : 'bg-neutrals-50'"
            />
            <skeleton-box width="200px" :classBgColor="index % 2 === 0 ? 'bg-neutrals-100' : 'bg-neutrals-50'" />
        </div>
    </div>
    <div class="w-328 h-full p-20p border-l border-neutrals-100">
        <skeleton-box class="mb-16p" width="80px" classBgColor="bg-neutrals-100" />
        <skeleton-box class="mb-16p" width="160px" classBgColor="bg-neutrals-100" />
        <skeleton-box class="mb-16p" width="295px" classBgColor="bg-neutrals-50" />
        <skeleton-box class="mb-16p" width="295px" classBgColor="bg-neutrals-50" />
        <skeleton-box class="mb-16p" width="295px" classBgColor="bg-neutrals-50" />
        <skeleton-box class="mb-16p" width="160px" classBgColor="bg-neutrals-50" />
        <skeleton-box width="160px" classBgColor="bg-neutrals-50" />
    </div>
</template>

<script lang="ts">
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'InboxComposerDropdownCannedResponseSkeleton',
    components: {
        SkeletonBox,
    },
});
</script>

<style lang="scss" scoped></style>
