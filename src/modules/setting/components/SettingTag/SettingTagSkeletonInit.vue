<template>
    <div class="pt-36p pb-16p px-40p">
        <div class="flex justify-between items-center">
            <skeleton-box width="143px" classBgColor="bg-neutrals-50" />
            <skeleton-box width="127px" classBgColor="bg-neutrals-50" />
        </div>
        <div class="flex justify-between items-center mt-58p mb-48p">
            <div class="setting-tag-skeleton__search">
                <skeleton-box width="100%" />
            </div>
            <div class="setting-tag-skeleton__button">
                <skeleton-box width="100%" />
            </div>
            <div class="setting-tag-skeleton__button">
                <skeleton-box width="100%" />
            </div>
        </div>
        <div class="flex items-center">
            <skeleton-box width="112px" classBgColor="bg-neutrals-50" />
            <skeleton-box width="112px" classBgColor="bg-neutrals-50" class="ml-12p" />
        </div>
    </div>
    <div class="py-28p px-40p border-t border-primary-10">
        <skeleton-box width="132px" class="mb-24p" />
        <SkeletonTable />
    </div>
</template>

<script lang="ts">
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import SkeletonTable from './SettingTagSkeletonTable.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SettingAttributeSkeleton',
    components: {
        SkeletonBox,
        SkeletonTable,
    },
});
</script>

<style lang="scss">
.setting-tag-skeleton{
    &__button {
        width: 20%;
        .custom-select-component{
            max-width: 100%;
        }
    }
    &__search {
        width: calc(100% - 40% - 96px);
    }
}
@media (max-width: 1440px) {
    .setting-tag-skeleton{
        &__button {
            width: 258px;
        }
        &__search {
            width: calc(100% - 258px - 258px - 96px);
            &.loading {
                width: calc(100% - 258px - 258px - 96px);
            }
        }
    }
}
</style>
