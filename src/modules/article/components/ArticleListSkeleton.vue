<template>
    <skeleton-box width="190px" />
    <div class="flex justify-between items-center mt-44p mb-40p">
        <div class="article-skeleton__search">
            <skeleton-box width="100%" />
        </div>
        <div class="article-skeleton__button mx-52p">
            <skeleton-box width="100%" />
        </div>
        <div class="article-skeleton__button">
            <skeleton-box width="100%" />
        </div>
    </div>
    <skeleton-box width="125px" />
    <div class="pt-32p">
        <SkeletonTable />
    </div>
</template>

<script lang="ts">
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import SkeletonTable from './ArticleListSkeletonTable.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SettingAttributeSkeleton',
    components: {
        SkeletonBox,
        SkeletonTable
    },
});
</script>

<style lang="scss">
.article-skeleton{
    &__button {
        width: 20%;
        .custom-select-component{
            max-width: 100%;
        }
    }
    &__search {
        width: calc(100% - 40% - 8px);
    }
}
@media (max-width: 1440px) {
    .article-skeleton{
        &__button {
            width: 258px;
        }
        &__search {
            width: calc(100% - 258px - 258px - 16px);
            &.loading {
                width: calc(100% - 258px - 258px - 96px);
            }
        }
    }
}
</style>