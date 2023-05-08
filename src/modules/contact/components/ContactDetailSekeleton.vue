<template>
    <div class="contact-detail__wrapper relative w-920 flex justify-between mx-auto mt-100p">
        <div class="contact-detail__left w-368">
            <Card type="shadow" class="relative pt-48p pb-24p px-24p mb-32p">
                <skeleton-box
                    class="absolute -top-32p"
                    type="circle"
                    width="64px"
                    height="64px"
                    backgroundColor="neutrals-100"
                />
                <skeleton-box class="mb-28p" width="208px" height="20px" />
                <skeleton-box class="mb-30p" width="224px" height="8px" backgroundColor="neutrals-50" />
                <skeleton-box class="mb-30p" width="224px" height="8px" backgroundColor="neutrals-50" />
                <skeleton-box class="mb-28p" width="224px" height="8px" backgroundColor="neutrals-50" />
                <skeleton-box class="rounded-4p" width="320px" height="40px" backgroundColor="neutrals-100" />
            </Card>
            <Card type="shadow" class="relative h-264 mb-32p px-24p py-16p">
                <skeleton-box width="144px" height="16px" backgroundColor="neutrals-100" />
            </Card>
        </div>
        <div class="contact-detail__right w-528">
            <Card type="shadow" class="relative h-496 mb-32p px-24p py-16p">
                <skeleton-box width="144px" height="16px" backgroundColor="neutrals-100" />
            </Card>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Card from '@/components/ui/CardComponent.vue';
import SkeletonBox from '@/components/ui/SkeletonBox.vue';

export default defineComponent({
    name: 'ContactDetailSkeleton',
    components: {
        Card,
        SkeletonBox,
    },
});
</script>
