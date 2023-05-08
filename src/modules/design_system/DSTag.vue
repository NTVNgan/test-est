<template>
    <div class="p-12p">
        <div class="grid grid-flow-col grid-cols-4 mb-16p">
            <div>
                <label for="type" class="block text-sm font-semibold text-gray-700 mb-12p">With Icon</label>
                <div class="group-tag mb-12p">
                    Default:
                    <div class="tag-item">
                        <Tag class="ml-4p" value="antique" icon="tag-solid10" @close="onCloseTag"> antique </Tag>
                    </div>
                </div>
                <div class="group-tag">
                    Disable:
                    <div class="tag-item">
                        <Tag class="ml-4p" value="antique" icon="tag-solid10" disabled @close="onCloseTag">
                            antique
                        </Tag>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Tag from '@/components/ui/TagComponent.vue';

export default defineComponent({
    name: 'Tag Component',
    components: { Tag },
    setup() {
        const onCloseTag = (value: any) => {
            console.log('close nè', value);
        };

        return {
            onCloseTag,
        };
    },
});
</script>

<style lang="scss" scoped>
.group-tag {
    .tag-item {
        display: inline-block;
    }
}
</style>
