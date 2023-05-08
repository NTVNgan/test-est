<template>
    <div class="py-24p px-16p mb-8p bg-white rounded-4p border border-solid border-neutrals-100">
        <div class="flex items-center mb-22p">
            <skeleton-box width="40px" height="40px" type="circle" />
            <skeleton-box width="calc((100% - 56px) - 40px)" height="16px" class="ml-16p" />
        </div>
        <skeleton-box width="calc(100% - 52px)" classBgColor="bg-neutrals-50" class="ml-12p" />
        <skeleton-box width="calc(100% - 106px)" classBgColor="bg-neutrals-50" class="ml-12p my-30p" />
        <skeleton-box width="calc(100% - 52px)" classBgColor="bg-neutrals-50" class="ml-12p" />
        <skeleton-box width="100%" height="36px" type="button" classBgColor="bg-neutrals-50" class="mt-22p" />
    </div>
</template>

<script lang="ts">
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'skeleton',
    components: {
        SkeletonBox
    }
})
</script>