<template>
    <div class="skeleton-conversation">
        <div
            class="py-20p px-16p flex items-center"
            v-for="index in 10"
            :key="index"
        >
            <skeleton-box width="40px" height="40px" type="circle" :classBgColor="index % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'" /> 
            <skeleton-box width="100%" class="ml-12p skeleton-name" :classBgColor="index % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SkeletonBox from '@/components/ui/SkeletonBox.vue';

export default defineComponent({
    name: 'Skeleton Conversation',
    components: {
        SkeletonBox,
    },
    setup() {
        const skeletonListConversationArr = ref<Array<any>>([
            { label: 'skeleton', label2: 'Group' },
            { label: 'skeleton', label2: 'Group' },
            { label: 'skeleton', label2: 'Group' },
            { label: 'skeleton', label2: 'Group' },
            { label: 'skeleton', label2: 'Group' },
            { label: 'skeleton', label2: 'Group' },
            { label: 'skeleton', label2: 'Group' },
            { label: 'skeleton', label2: 'Group' },
            { label: 'skeleton', label2: 'Group' },
            { label: 'skeleton', label2: 'Group' },
        ]);

        return {
            skeletonListConversationArr,
        }
    }
})
</script>

<style lang="scss" scoped>
.skeleton-conversation{
    .skeleton-name{
        width: calc(100% - 52px)!important;
    }
}
</style>
