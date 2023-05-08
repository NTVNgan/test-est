<template>
    <div
        id="canned-list"
        class="flex flex-col px-8p overflow-y-auto scrollbar--transparent max-h-296 font-body"
        @scroll="handleScrollToBottom"
    >
        <div
            tabindex="-1"
            class="canned-clickable py-8p px-12p rounded-4p cursor-pointer hover:bg-neutrals-50"
            :class="activeIndex === index ? 'bg-neutrals-50' : ''"
            v-for="(item, index) in cannedResponses"
            :key="item._id"
            :id="`canned-item-${index}`"
            :data-index="index"
            @click="onSelectValueByIndex(index)"
            @mouseover="onMouseOverItem(index)"
        >
            <p class="truncate text-14 font-medium mb-2p" v-html="setHightlightShortcut(item.shortcut)"></p>
            <p class="truncate text-12 mb-2p">{{ item.name }}</p>
            <p class="truncate text-12 text-neutrals-300" v-html="formatContent(item.content)"></p>
        </div>
        <div v-if="isLoadMore" class="h-48 w-full flex items-center justify-center bg-white z-1">
            <Spinner size="small" color="#3E6DDA" />
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed, watch, nextTick, inject } from 'vue';
import { useCannedResponse } from '@/modules/setting/composables/useCannedResponse';
import Spinner from '@/components/ui/Spinner.vue';
import debounce from 'lodash/debounce';

export default {
    name: 'InboxComposerCaretCannedResponse',
    props: {
        keyword: {
            default: '/',
        },
    },
    components: {
        Spinner,
    },
    setup(props: any, { emit }: any) {
        const emitter: any = inject('emitter');
        let handleKeydown: any = null;
        const activeIndex = ref(0);
        const isCannedLoading = ref(false);
        const isLoadMore = ref(false);
        const cannedNextPage = ref(null);

        const { cannedResponses, getCannedResponse, loading } = useCannedResponse();

        const formatContent = computed(() => {
            return (content: any) => {
                if (typeof content === 'object') return '';
                const iconImage =
                    ' <svg class="inline-block" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                    '<path fill-rule="evenodd" clip-rule="evenodd" d="M15.6875 5.25H4.3125C3.57422 5.25 3 5.85156 3 6.5625V14.4375C3 15.1758 3.57422 15.75 4.3125 15.75H15.6875C16.3984 15.75 17 15.1758 17 14.4375V6.5625C17 5.85156 16.3984 5.25 15.6875 5.25ZM4.48965 8.16394C4.48965 7.42614 5.05977 6.82248 5.83111 6.82248C6.56892 6.82248 7.17258 7.42614 7.17258 8.16394C7.17258 8.93528 6.56892 9.5054 5.83111 9.5054C5.05977 9.5054 4.48965 8.93528 4.48965 8.16394ZM5.26829 14.1776C4.99215 14.1776 4.76829 13.9537 4.76829 13.6776V12.5678L6.07621 11.2599C6.2439 11.0922 6.47865 11.0922 6.64634 11.2599L7.9878 12.5678L11.9787 8.57697C12.1463 8.40929 12.3811 8.40929 12.5488 8.57697L15.5 11.4947V13.6776C15.5 13.9537 15.2761 14.1776 15 14.1776H5.26829Z" fill="#828292"/>\n' +
                    '</svg> ';
                let res = content
                    .replaceAll('&lt;', '<')
                    .replaceAll('&gt;', '>')
                    .replaceAll('<br>', '');
                res = res
                    .replace(/<svg[^>]*>/g, '')
                    .replace(/<path[^>]*>/g, '')
                    .replace(/<br[^>]*>/g, '')
                    .replace(/<p[^>]*>/g, '')
                    .replace(/<\/svg[^>]*>/g, '')
                    .replace(/<\/p[^>]*>/g, '')
                    .replace(/<\/path[^>]*>/g, '')
                    .replace(/<img[^>]*>/g, '<has<img>>')
                    .replace(/<div[^>]*>/g, '')
                    .replace(/<\/div[^>]*>/g, '');

                return res.replace(/(<has<img>>)\1+/g, '$1').replace(/<has<img>>/g, iconImage);
            };
        });
        const setHightlightShortcut = computed(() => {
            return (content: any) => {
                if (!props.keyword) return;
                const keyword = props.keyword.slice(1);
                if (content.slice(0, props.keyword.length - 1) === keyword) {
                    return `<span class="text-neutrals-900">/${content.slice(0, props.keyword.length - 1)}</span><span class="text-neutrals-300">${content.slice(props.keyword.length - 1)}</span>`;
                } else {
                    return `<span class="text-neutrals-900">/</span><span class="text-neutrals-300">${content}</span>`;
                }
            };
        });
        const selectVal = ref(null);
        const envURL = process.env.VUE_APP_FILE_URL;

        const refreshData = () => {
            cannedNextPage.value = null;
            // cannedResponses.value = [];
        };
        const onSearchCannedResponse = async (keywords: string) => {
            console.log(keywords, 'keywords');
            const data = await getCannedResponse({
                shortcut: keywords,
                next_page: cannedNextPage.value,
            });
            cannedResponses.value = data.data;
            cannedNextPage.value = data.next_page;
        };
        const onLoadmoreCannedResponse = async (keywords: string) => {
            console.log(keywords, 'keywords');
            const data = await getCannedResponse({
                shortcut: keywords,
                next_page: cannedNextPage.value,
            });
            cannedResponses.value = [...cannedResponses.value, ...data.data];
            cannedNextPage.value = data.next_page;
        };
        const handleScrollToBottom = async (target: any) => {
            if (target.target.scrollTop + target.target.clientHeight >= target.target.scrollHeight) {
                if (cannedNextPage.value) {
                    isLoadMore.value = true;
                    await onLoadmoreCannedResponse('');
                    isLoadMore.value = false;
                }
            }
        };

        const onSelectValueByIndex = (index: number) => {
            emit('select', cannedResponses.value[index]);
            emitter.off('contentKeyDownCaretCannedResponse', handleKeydown);
        };

        const isOverflow = (item: any) => {
            if (item) {
                const { clientWidth } = item;
                const elList: any = document.getElementById('canned-list');
                const listRect = elList.getBoundingClientRect();
                const itemRect = item.getBoundingClientRect();
                return listRect.bottom - itemRect.bottom < 0 || listRect.bottom - itemRect.bottom >= clientWidth - 56;
            } else return false;
        };

        handleKeydown = (event: any) => {
            // Check for up/down key presses
            const elList: any = document.getElementById('canned-list');
            let move = 0;
            switch (event.keyCode) {
                case 13:
                    emit('select', cannedResponses.value[activeIndex.value]);
                    emitter.off('contentKeyDownCaretCannedResponse', handleKeydown);
                    break;
                case 38: // Up arrow
                    // Remove the highlighting from the previous element
                    console.log('up');
                    activeIndex.value = activeIndex.value !== 0 ? activeIndex.value - 1 : 0;
                    move = 1;
                    break;
                case 40: // Down arrow
                    // Remove the highlighting from the previous element
                    console.log('down');
                    activeIndex.value =
                        activeIndex.value !== cannedResponses.value.length - 1
                            ? activeIndex.value + 1
                            : activeIndex.value;
                    move = -1;
                    break;
            }
            const el = document.getElementById(`canned-item-${activeIndex.value}`);

            if (isOverflow(el)) {
                const num = elList.scrollTop;
                elList.scrollTop = move > 0 ? num - 56 : num + 56;
            }
        };

        emitter.on('contentKeyDownCaretCannedResponse', handleKeydown);

        const onMouseOverItem = (index: number) => {
            activeIndex.value = index;
        };

        watch(
            () => props.keyword,
            debounce(async newVal => {
                console.log(newVal, 'newVal');
                if (newVal) {
                    const keywords = newVal.replace('/', '');
                    refreshData();
                    await onSearchCannedResponse(keywords);
                }
            }, 500),
        );
        watch(
            () => props.keyword,
            newVal => {
                refreshData();
            },
        );
        watch(
            () => cannedResponses.value,
            (newVal: any) => {
                nextTick();
                if (newVal.length > 0) {
                    activeIndex.value = 0;
                }
            },
        );
        return {
            selectVal,
            envURL,
            activeIndex,
            formatContent,
            setHightlightShortcut,
            cannedResponses,
            isLoadMore,
            onSelectValueByIndex,
            onMouseOverItem,
            handleScrollToBottom,
        };
    },
};
</script>

<style lang="scss"></style>
