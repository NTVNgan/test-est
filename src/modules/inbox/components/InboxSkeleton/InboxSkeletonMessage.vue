<template>
    <div class="inbox-skeleton-message">
        <div class="box-message-skeleton overflow-hidden flex flex-col h-full absolute top-0">
            <div
                class="items-center flex justify-end box-assign-message p-16p pt-20p pl-24p border-b border-neutrals-100 font-bold flex-none"
            >
                <skeleton-box width="60px" class="mr-8p" />
                <skeleton-box width="20px" height="20px" type="circle" />
            </div>
            <div class="overflow-y-auto flex-auto box-message bg-white">
            </div>
        </div>
        <div class="inbox-composer mb-16p mx-24p absolute bottom-0 width-fill">
            <card-component class="py-12p flex flex-col" type="shadow">
                <skeleton-box width="128px" class="absolute left-16p top-18p" />
                <skeleton-box width="84px" height="36px" type="button" class="absolute right-16p bottom-12p" />
            </card-component>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import CardComponent from '@/components/ui/CardComponent.vue';

export default defineComponent({
    name: 'Skeleton Message',
    components: {
        SkeletonBox,
        CardComponent,
    },
});
</script>
<style lang="scss" scoped>
.inbox-composer {
    z-index: 2;
}
.box-message-skeleton {
    z-index: 2;
    background-color: #fff;
    width: -webkit-fill-available;
}
.inbox-skeleton-message{
    .inbox-composer{
        max-height: 118px;
        height: 100%;
        .card{
            height: 100%;
        }
    }
}
</style>
