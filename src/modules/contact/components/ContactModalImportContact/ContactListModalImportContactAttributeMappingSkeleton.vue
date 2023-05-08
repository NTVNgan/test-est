<template>
    <div
        v-for="(data, data_index) in 4"
        :key="`col-${data_index}`"
        class="h-256 w-218 inline-block rounded-4p border border-neutrals-100"
        :class="{ 'ml-8p': data_index > 0 }"
    >
        <div class="h-68 px-12p pt-18p bg-neutrals-100">
            <skeleton-box width="194px" height="8px" classBgColor="bg-neutrals-200" />
        </div>
        <div
            class="h-36 py-14p px-12p bg-white text-14 text-neutrals-400 border-t border-neutrals-100"
            v-for="item in 5"
            :key="item"
        >
            <skeleton-box
                :classBgColor="`bg-neutrals-${item % 2 === 0 ? '50' : '100'}`"
                height="8px"
                :width="item === 1 ? '100px' : '140px'"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SkeletonBox from '@/components/ui/SkeletonBox.vue';

export default defineComponent({
    name: 'ContactListModalImportContactAttributeMappingSkeleton',
    components: {
        SkeletonBox,
    },
    setup(props, { emit }) {
        return {};
    },
});
</script>

<style lang="scss" scoped></style>
