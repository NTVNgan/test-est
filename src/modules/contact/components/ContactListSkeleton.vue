<template>
    <div class="contacts-segment py-24p px-40p h-full">
        <div class="text-24 font-bold flex items-center">
            <skeleton-box width="136px" />
        </div>

        <div class="contacts-segment__data mt-24p">
            <div class="flex justify-between items-center mb-16p">
                <skeleton-box width="80px" />
            </div>
            <div class="flex justify-between items-center mb-16p">
                <skeleton-box width="86px" />
            </div>
            <table-skeleton-component :isBorder="true"/>
        </div>
    </div>
</template>

<script>
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import TableSkeletonComponent from '@/components/ui/TableSkeletonComponent.vue';

export default {
    name: 'ContactListBySearch',
    components: {
        SkeletonBox,
        TableSkeletonComponent,
    },
};
</script>

<style lang="scss" scoped>
</style>