<template>
    <div class="inbox-recent-page">
        <template v-if="recentList.length">
            <div class="m-steps m-steps-vertical">
                <div
                    class="m-steps-item m-steps-item-finish m-steps-item-custom"
                    v-for="(item, i) in recentPageList"
                    :key="i"
                >
                    <div class="m-steps-item-container">
                        <div class="m-steps-item-tail"></div>
                        <div class="m-steps-item-icon">
                            <span class="m-steps-icon"></span>
                        </div>
                        <div class="m-steps-item-content">
                            <div class="m-steps-item-description">
                                <div class="content" ref="contentParent">
                                    <p
                                        class="text-12 text-neutrals-400 mb-2p"
                                    >{{filters.formatTime(item.created_at)}}</p>
                                    <Tooltip
                                        class="text-14"
                                        size="small"
                                        type="light"
                                        position="top"
                                        showByTruncate
                                        :content="item.content"
                                        :timeout="1000"
                                    >
                                        <a :href="item.content" target="_blank"
                                            class="truncate inline-block w-full"
                                        >{{ item.content }}</a>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <span v-else class="block text-14 px-8p py-16p text-neutrals-400">No data found</span>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Tooltip from '@/components/ui/TooltipComponent.vue';
import { store } from '@/store';
import filters from '@/utils/filters';

export default defineComponent({
    name: 'recent page',
    components: {
        Tooltip,
    },
    props: {
        recentList: {
            type: Array,
            default: () => [],
        },
    },
    setup(props) {
        const contentChild = ref<HTMLElement>();
        const contentParent = ref<HTMLElement>();
        const showTooltip = ref<boolean>(true);
        const isShowTooltip = () => {
            if (contentChild.value && contentParent.value) {
                const child = contentChild.value.getBoundingClientRect().width;
                const parent = contentParent.value.getBoundingClientRect().width;
                if (child == parent) showTooltip.value = false;
            }
        };

        // const recentPageList = ref<any>(props.recentList ? props.recentList : null);
        const recentPageList = computed(() => {
            return props.recentList;
        });

        return {
            contentChild,
            contentParent,
            showTooltip,
            isShowTooltip,
            recentPageList,
            filters,
        };
    },
});
</script>

<style lang="scss">
.m-steps-vertical {
    display: block;
    margin-top: 30px;
    .m-steps-item {
        display: block;
        position: relative;
        &-tail {
            position: absolute;
            top: 3px;
            left: 10px;
            height: 100%;
            &:after {
                content: '';
                display: inline-block;
                height: 100%;
                width: 1px;
                border-left: 1px dashed #b4b4be;
            }
        }
        &-icon {
            float: left;
            margin-right: 12px;
            height: auto;
            width: 20px;
            display: flex;
            justify-content: center;
            .m-steps-icon {
                width: 8px;
                height: 8px;
                background: #828292;
                border-radius: 50%;
                position: relative;
                top: 0;
                left: 0.5px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        &-content {
            min-height: 52px;
            padding-top: 15px;
            .m-steps-item-description {
                margin-top: -30px;
                padding-bottom: 12px;
                .content {
                    display: flex;
                    flex-direction: column;
                }
            }
        }
        &:last-child {
            .m-steps-item-tail::after {
                display: none;
            }
        }
    }
    .tooltip-component {
        width: 100%;
    }
}
</style>
