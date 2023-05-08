<template>
    <div>
        <template v-if="$slots.loading && loading">
            <slot name="loading"></slot>
        </template>
        <div v-show="!loading">
            <div class="tab-component__header">
                <nav class="-mb-px flex " aria-label="Tabs">
                    <a
                        v-for="(tab, index) in tabs"
                        :key="tab.key"
                        :href="tab.href"
                        @click="selectTab(tab)"
                        class="cursor-pointer tab rounded-4p text-center "
                        :class="[
                            tab.key === activeTab
                                ? ' text-neutrals-900 selected-tab'
                                : ' text-neutrals-500 unselected-tab',
                            tabs.length !== index + 1 && type === 'underline' && fitted ? 'mr-24p' : '',
                            tabs.length !== index + 1 && type === 'underline' && !fitted ? 'mr-8p' : '',
                            tabs.length !== index + 1 && type === 'pill' ? 'mr-8p' : '',
                            !fitted && type !== 'pill' ? 'flex-1' : '',
                            tab.key === activeTab && type === 'pill' ? 'bg-neutrals-50' : '',
                            type === 'underline' && tab.key !== activeTab ? 'hover:text-neutrals-900' : '',
                            type === 'pill' && tab.key !== activeTab
                                ? 'hover:bg-neutrals-50 hover:text-neutrals-500 active:bg-neutrals-100'
                                : '',
                            tab.key,
                        ]"
                        :aria-current="tab.current ? 'page' : undefined"
                    >
                        <div
                            class="tab__name text-14 rounded-4p"
                            :class="[
                                type === 'underline' ? 'py-8p px-2p h-36' : 'px-12p py-2p',
                                type === 'pill' && tab.key !== activeTab ? ' hover:text-neutrals-500' : '',
                                { 'font-medium': tab.key === activeTab }
                            ]"
                        >
                            {{ tab.name }}
                        </div>
                        <div
                            v-if="type === 'underline'"
                            class="tab__bar whitespace-nowrap font-medium h-3 w-full rounded-3p mt-4p"
                            :class="{
                                'bg-primary-500': tab.key === activeTab,
                            }"
                        ></div>
                    </a>
                </nav>
            </div>
            <div class="tab-content h-full">
                <slot> </slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';

export default defineComponent({
    name: 'TabComponent',
    props: {
        type: {
            type: String,
            default: 'underline',
        },
        fitted: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            type: String,
            default: null,
        },
        defaultValue: {
            type: String,
            default: null,
        },
        tabs: {
            type: Array,
            default: null,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'change'],

    setup(props, { emit, slots }) {
        const activeTab = computed({
            get: () => props.modelValue,
            set: value => emit('update:modelValue', value),
        });

        const selectTab = (tabKey: any) => {
            activeTab.value = tabKey.key;
            emit('change', tabKey);

            const tabcontent: any = document.getElementsByClassName('tab-content');
            tabcontent[0].children.forEach((element: any) => {
                element.style.display = 'none';
            });

            const tabContentId: any = document.getElementById(tabKey.key);
            if (tabContentId === null) return;
            tabContentId.style.display = 'block';
        };

        const tabContents = () => {
            const tabcontent: any = document.getElementsByClassName('tab-content');
            tabcontent[0].children.forEach((element: any) => {
                if (props.modelValue === element.id){
                    element.style.display = "block";
                }
            });
        };

        onMounted(() => {
            tabContents();
        });

        return {
            tabContents,
            activeTab,
            selectTab,
        };
    },
});
</script>

<style lang="scss" scoped>
.unselected-tab {
    &:hover {
        .tab {
            &__name {
                // color: #141417;
            }
            &__bar {
                background-color: #98b1eb;
            }
        }
    }
    &:active {
        .tab {
            &__name {
                color: #141417;
            }
            &__bar {
                background-color: #5e85e0;
            }
        }
    }
}

.tab {
    &:focus-within,
    &:focus {
        outline: none;
        .tab {
            &__name {
                box-shadow: 0px 0px 0px 1px #3e6dda inset;
            }
        }
    }
}
.tab-content{
    >:deep(*){
        display: none;
    }
}
</style>
