<template>
    <div
        ref="mentionListRef"
        id="mention-list"
        class="flex flex-col px-8p overflow-y-auto scrollbar--transparent max-h-296"
    >
        <div
            class="mention-clickable px-8p py-12p flex items-center rounded-4p cursor-pointer active:bg-primary-50 h-36"
            :class="activeIndex === index ? 'bg-neutrals-50' : ''"
            v-for="(item, index) in userList"
            :key="item._id"
            :id="`mention-item-${index}`"
            tabindex="-1"
            :data-index="index"
            @click="onSelectValueByIndex(index)"
            @mouseover="onMouseOverItem(index)"
        >
            <template v-if="item.avatar_src">
                <avatar-component
                    class="mr-8p truncate"
                    size="extra-small"
                    :image="envURL + '/' + item.avatar_src"
                    :label-avatar="item.full_name"
                    :bgAvatar="item.avatar_bg"
                    label-show
                />
            </template>
            <template v-else>
                <avatar-component
                    size="extra-small"
                    :label-avatar="item.full_name"
                    :bgAvatar="item && item.avatar_bg"
                    label-show
                />
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed, watch, nextTick, onUnmounted, inject } from 'vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';

export default {
    name: 'InboxComposerMention',
    props: {
        users: {
            default: [],
        },
    },
    components: {
        AvatarComponent,
    },
    setup(props: any, { emit }: any) {
        const emitter: any = inject('emitter');
        let handleKeydown: any = null;
        const activeIndex = ref(0);
        const mentionListRef = ref<any>(null);
        const userList = computed(() => {
            return props.users;
        });
        const selectVal = ref(null);
        const envURL = process.env.VUE_APP_FILE_URL;

        const onSelectValueByIndex = (index: number) => {
            if (userList.value[index]) {
                emit('select', userList.value[index]);
                emitter.off('contentKeyDown', handleKeydown);
            }
        };

        const isOverflow = (item: any) => {
            if (item) {
                const { clientWidth, clientHeight, scrollWidth, scrollHeight } = item;
                const elList: any = document.getElementById('mention-list');
                const listRect = elList.getBoundingClientRect();
                const itemRect = item.getBoundingClientRect();
                return listRect.bottom - itemRect.bottom < 0 || listRect.bottom - itemRect.bottom >= clientWidth - 56;
            } else return false;
        };

        handleKeydown = (event: any) => {
            // Check for up/down key presses
            const elList: any = document.getElementById('mention-list');
            let move = 0;
            const handleOverflow = () => {
                const el = document.getElementById(`mention-item-${activeIndex.value}`);
                const overflow: any = isOverflow(el);
                if (overflow) {
                    const num = elList.scrollTop;
                    elList.scrollTop = move > 0 ? num - 56 : num + 56;
                    if (isOverflow(el)) el?.scrollIntoView({ behavior: 'smooth' })
                }
            };
            switch (event.keyCode) {
                case 13: // Up arrow
                    if (userList.value[activeIndex.value]) {
                        emit('select', userList.value[activeIndex.value]);
                        emitter.off('contentKeyDown', handleKeydown);
                    }
                    break;
                case 38: // Up arrow
                    // Remove the highlighting from the previous element
                    activeIndex.value = activeIndex.value !== 0 ? activeIndex.value - 1 : 0;
                    move = 1;
                    handleOverflow();
                    break;
                case 40: // Down arrow
                    // Remove the highlighting from the previous element
                    activeIndex.value =
                        activeIndex.value !== props.users.length - 1 ? activeIndex.value + 1 : activeIndex.value;
                    move = -1;
                    handleOverflow();
                    break;
            }
        };

        emitter.on('contentKeyDown', handleKeydown);

        const onMouseOverItem = (index: number) => {
            activeIndex.value = index;
        };

        watch(
            () => props.users,
            () => {
                nextTick();
                // const elList = document.getElementById('mention-list');
                if (props.users.length > 0) {
                    activeIndex.value = 0;
                    mentionListRef.value.scrollTop = 0;
                }
                // else {
                // }
            },
        );

        onUnmounted(() => {
            // document.removeEventListener('mousedown', handleKeydown, true);
        });
        return {
            userList,
            selectVal,
            envURL,
            activeIndex,
            onSelectValueByIndex,
            onMouseOverItem,
            mentionListRef,
        };
    },
};
</script>

<style lang="scss">
</style>