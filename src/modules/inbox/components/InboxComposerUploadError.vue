<template>
    <teleport to="#upload">
        <transition-group name="bounce">
            <div
                v-if="showUploadErrorSync"
                class="max-h-256 w-384 fixed bottom-24p left-24p z-999 flex flex-col font-body shadow-3p rounded-4p overflow-hidden"
            >
                <div class="h-44 p-12p bg-neutrals-600 text-white flex items-center justify-between shadow-deep-1">
                    <span class="text-14 font-medium mr-8px">{{ headerTitle }}</span>
                    <icon-component
                        class="ml-auto cursor-pointer"
                        :name="`chevron-${isExpand ? 'down' : 'up'}`"
                        color="white"
                        @click="isExpand = !isExpand"
                    />
                    <icon-component class="ml-8p cursor-pointer" name="times" color="white" @click="closeUploadError" />
                </div>
                <transition-group name="toggle-content">
                    <div v-if="isExpand" class="flex-1 w-full bg-white overflow-y-auto scrollbar--transparent">
                        <div
                            v-for="(item, index) in errorDataSync"
                            :key="item"
                            class="py-8p pl-8p pr-12p w-full flex"
                            :class="{ 'border-t border-neutrals-100': index > 0 }"
                        >
                            <icon-component
                                class="mr-8p w-24"
                                name="exclamation-circle"
                                color="error-3"
                                @click="closeUploadError"
                            />
                            <div class="text-14 mt-2p flex-1 error__text">
                                {{ item.error }}
                            </div>
                        </div>
                    </div>
                </transition-group>
            </div>
        </transition-group>
    </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';

export default defineComponent({
    name: 'InboxComposerUploadError',
    props: {
        showUploadError: {
            type: Boolean,
            default: false,
        },
        headerTitle: {
            type: String,
            default: '',
        },
        errorData: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        IconComponent,
    },
    setup(props, { emit }) {
        const isExpand = ref<boolean>(true);
        const showUploadErrorSync = computed({
            get(): boolean {
                return props.showUploadError;
            },
            set(value: boolean) {
                emit('update:showUploadError', value);
            },
        });
        const errorDataSync = computed({
            get(): any {
                return props.errorData;
            },
            set(value: any) {
                emit('update:errorData', value);
            },
        });

        const closeUploadError = async () => {
            showUploadErrorSync.value = false;
            errorDataSync.value = [];
        };

        return {
            showUploadErrorSync,
            isExpand,
            errorDataSync,
            closeUploadError,
        };
    },
});
</script>

<style lang="scss" scoped>
.error__text {
    word-break: break-word;
    word-wrap: break-word;
}
</style>
