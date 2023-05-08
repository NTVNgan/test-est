<template>
    <div class="contacts-segment px-16p h-full">
        <div class="btn-config-segment-skeleton text-24 mb-22p font-bold flex items-center justify-end">
            <skeleton-box width="32px" height="32px" />
        </div>
        <div class="text-24 font-bold px-8p flex items-center">
            <skeleton-box width="182px" />
        </div>
        <div class="contacts-segment__data mt-32p px-8p">
            <div class="flex justify-between items-center mb-28p">
                <skeleton-box width="75.5px" />
                <skeleton-box width="75.5px" />
            </div>
            <div class="flex justify-between items-center mb-28p">
                <skeleton-box width="75.5px" />
                <skeleton-box width="75.5px" />
            </div>
            <div class="flex justify-between items-center mb-28p">
                <skeleton-box width="75.5px" />
                <skeleton-box width="75.5px" />
            </div>
            <div class="flex justify-between items-center mb-28p">
                <skeleton-box width="75.5px" />
                <skeleton-box width="75.5px" />
            </div>
            <div class="flex justify-between items-center mb-28p">
                <skeleton-box width="75.5px" />
                <skeleton-box width="75.5px" />
            </div>
        </div>
    </div>
</template>

<script>
import SkeletonBox from '@/components/ui/SkeletonBox.vue';

export default {
    name: 'ContactListSegmentSkeleton',
    components: {
        SkeletonBox,
    },
};
</script>

<style lang="scss" scoped>
.btn-config-segment-skeleton div {
    border-radius: 4px;
}
</style>
