<template>
    <div
        class="h-full bg-neutrals-50 relative transition-all duration-300 ease-in-out"
        :class="isHideSubMenu ? 'w-0' : 'w-230'"
    >
        <div class="absolute top-13p -right-12p z-1">
            <tooltip-component class="inline-flex" position="right" :content="isHideSubMenu ? 'Expand' : 'Collapse'">
                <button-component
                    class="border-opacity-0 rounded-50% shadow-deep-1 bg-white collapse__button"
                    size="small"
                    type="outline"
                    :icon="isHideSubMenu ? 'ChevronRight' : 'ChevronLeft'"
                    @click="toggleSubmenu"
                />
            </tooltip-component>
        </div>
        <div
            class="overflow-hidden flex flex-col h-full transition-all duration-300"
            :class="{
                'w-0': isHideSubMenu,
                'w-230': !isHideSubMenu,
            }"
        >
            <div class="border-b border-neutrals-100 flex justify-between items-center">
                <p class="text-14 p-16p uppercase font-bold text-neutrals-400 flex-none">
                    {{ heading }}
                </p>
                <div class="mr-16p">
                    <slot name="header-addon"></slot>
                </div>
            </div>
            <div
                class="submenu__wrapper mb-20p flex-auto"
                ref="submenu"
                :class="{
                    'px-8p': hideDefaultContent,
                    'mt-32p px-16p overflow-y-auto': !hideDefaultContent,
                }"
            >
                <div v-show="!hideDefaultContent">
                    <template v-if="loading">
                        <div class="w-inherit flex justify-between py-10p px-8p">
                            <skeleton-box width="76px" />
                            <skeleton-box width="76px" />
                        </div>
                        <div class="w-inherit flex justify-between py-10p px-8p mt-8p">
                            <skeleton-box width="76px" />
                            <skeleton-box width="76px" />
                        </div>
                        <div class="w-inherit flex justify-between py-10p px-8p mt-8p">
                            <skeleton-box width="76px" />
                            <skeleton-box width="76px" />
                        </div>
                        <div class="w-inherit flex justify-between py-10p px-8p mt-8p">
                            <skeleton-box width="76px" />
                            <skeleton-box width="76px" />
                        </div>
                    </template>
                    <tooltip-component
                        v-else
                        class="submenu__tooltip"
                        type="light"
                        position="right"
                        v-for="(item, index) in submenus"
                        :key="`submenu-${index}`"
                        :content="item.label"
                        showByTruncate
                    >
                        <router-link
                            v-if="linkWithParams"
                            :to="{ name: item.name, params: item.params }"
                            @click="selectSub(item, index)"
                            class="
                                flex
                                items-center
                                px-16p
                                py-10p
                                mb-8p
                                rounded-4p
                                text-14 text-neutrals-700
                                hover:bg-neutrals-100
                                transition
                                duration-300
                                ease-in-out
                            "
                            :class="{ 'mb-3p': showSubmenu && item.submenu && item.expand }"
                            role="menuitem"
                            :active-class="
                                typeof item.submenu !== undefined && typeof item.expand !== undefined && item.expand
                                    ? ''
                                    : 'bg-neutrals-100'
                            "
                            v-slot="{ isExactActive, isActive }"
                        >
                            <span
                                class="flex-auto truncate"
                                :class="{ 'font-bold text-primary-500': isExactActive || isActive }"
                            >
                                {{ item.label }}
                            </span>
                            <span
                                v-if="showCount"
                                class="flex-none ml-16p"
                                :class="{ 'text-primary-500': isExactActive || isActive }"
                            >
                                {{ !numberComma ? item.count : item.count.toLocaleString() }}
                            </span>
                        </router-link>
                        <router-link
                            v-else-if="!item.submenu"
                            :to="{ name: item.name }"
                            @click="selectSub(item, index)"
                            class="
                                flex
                                items-center
                                px-16p
                                py-10p
                                mb-8p
                                rounded-4p
                                text-14 text-neutrals-700
                                hover:bg-neutrals-100
                                transition
                                duration-300
                                ease-in-out
                            "
                            :class="{ 'mb-3p': showSubmenu && item.submenu && item.expand }"
                            role="menuitem"
                            :active-class="
                                typeof item.submenu !== undefined && typeof item.expand !== undefined && item.expand
                                    ? ''
                                    : 'bg-neutrals-100'
                            "
                            v-slot="{ isExactActive, isActive }"
                        >
                            <span
                                class="flex-auto truncate"
                                :class="{ 'font-bold text-primary-500': isExactActive || isActive }"
                            >
                                {{ item.label }}
                            </span>
                            <span
                                v-if="showCount"
                                class="flex-none ml-16p"
                                :class="{ 'text-primary-500': isExactActive || isActive }"
                            >
                                {{ !numberComma ? item.count : item.count.toLocaleString() }}
                            </span>
                            <span
                                v-if="showSubmenu && item.submenu"
                                class="flex-none ml-16p"
                                :class="{ 'active-expand': isExactActive || isActive }"
                            >
                                <i class="arrow down logo mx-auto mb-3p"></i>
                            </span>
                        </router-link>
                        <a
                            v-else
                            @click="selectSub(item, index)"
                            class="
                                flex
                                label-sub-menu-expand
                                items-center
                                px-16p
                                py-10p
                                mb-8p
                                rounded-4p
                                text-14 text-neutrals-700
                                hover:bg-neutrals-100
                                transition
                                duration-300
                                ease-in-out
                                cursor-pointer
                            "
                            :class="{
                                'mb-3p': item.expand,
                                'bg-neutrals-100':
                                    !item.expand && checkActiveSubmenu(item.submenu, item.childOfSubmenu),
                            }"
                            role="menuitem"
                        >
                            <span
                                class="flex-auto truncate"
                                :class="{
                                    'font-bold text-primary-500': checkActiveSubmenu(item.submenu, item.childOfSubmenu),
                                }"
                            >
                                {{ item.label }}
                            </span>
                            <span
                                v-if="showCount"
                                class="flex-none ml-16p"
                                :class="{ 'text-primary-500': checkActiveSubmenu(item.submenu, item.childOfSubmenu) }"
                            >
                                {{ !numberComma ? item.count : item.count.toLocaleString() }}
                            </span>
                            <span
                                class="flex-none ml-16p"
                                :class="{ 'active-expand': checkActiveSubmenu(item.submenu, item.childOfSubmenu) }"
                            >
                                <i class="arrow down logo mx-auto mb-3p"></i>
                            </span>
                        </a>
                        <template
                            v-if="
                                showSubmenu &&
                                typeof item.submenu !== undefined &&
                                typeof item.expand !== undefined &&
                                item.expand
                            "
                        >
                            <tooltip-component
                                class="submenu__tooltip"
                                type="light"
                                position="right"
                                v-for="(sub, key) in item.submenu"
                                @click="selectSubInSub(sub)"
                                :key="`submenu-${key}`"
                                :content="sub.label"
                                showByTruncate
                            >
                                <router-link
                                    :to="{ name: sub.name, params: sub.params }"
                                    class="
                                        flex
                                        items-center
                                        pl-24p
                                        pr-16p
                                        py-8p
                                        mb-3p
                                        rounded-4p
                                        text-14 text-neutrals-700
                                        hover:bg-neutrals-100
                                        transition
                                        duration-300
                                        ease-in-out
                                    "
                                    :class="{ 'end-submenu': key === item.submenu.length - 1 }"
                                    role="menuitem"
                                    active-class="bg-neutrals-100"
                                    v-slot="{ isExactActive, isActive }"
                                >
                                    <span
                                        class="flex-auto truncate"
                                        :class="{ 'font-bold text-primary-500': isExactActive || isActive }"
                                    >
                                        {{ sub.label }}
                                    </span>
                                </router-link>
                            </tooltip-component>
                        </template>
                    </tooltip-component>
                </div>
                <slot name="content"></slot>
            </div>
            <div class="footer-submenu">
                <slot name="child-menu-addon"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import ButtonComponent from './ButtonComponent.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import { useRoute } from 'vue-router';
export default defineComponent({
    components: {
        ButtonComponent,
        TooltipComponent,
        SkeletonBox,
    },
    props: {
        heading: {
            type: String,
            default: '',
        },
        showCount: {
            type: Boolean,
            default: false,
        },
        navLink: {
            type: Array,
            default: () => [],
        },
        linkWithParams: {
            type: Boolean,
            default: false,
        },
        navLinkParams: {
            type: Array,
            default: () => [],
        },
        loading: {
            type: Boolean,
            default: false,
        },
        showSubmenu: {
            type: Boolean,
            default: false,
        },
        numberComma: {
            type: Boolean,
            default: false,
        },
        hideDefaultContent: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { emit }) {
        const isHideSubMenu = ref(false);
        const submenu = ref<HTMLElement>();
        const toggleSubmenu = () => {
            isHideSubMenu.value = !isHideSubMenu.value;
            emit('update:modelValue', !isHideSubMenu.value);
        };
        const route = useRoute();

        const submenus = computed(() => {
            let arrLink = props.navLink;
            if (props.linkWithParams) arrLink = props.navLinkParams;
            if (arrLink.length < 1) return {};
            return arrLink.map((item: any) => {
                return {
                    ...item,
                    count: item.count,
                };
            });
        });

        const checkActiveSubmenu = computed(() => {
            return (submenu: any, childOfSubmenu: any) => {
                if (submenu.length < 1) return false;
                const findSub = submenu.findIndex((sub: any) => sub.name === route.name);
                if (findSub > -1) return true;
                else {
                    if (typeof childOfSubmenu === 'undefined') return false;
                    if (childOfSubmenu.length < 1) return false;
                    const findChildSub = childOfSubmenu.findIndex((sub: any) => sub.name === route.name);
                    return findChildSub > -1;
                }
            };
        });

        const selectSub = (item: any, index: any) => {
            emit('change', item, index);
        };

        const selectSubInSub = (item: any) => {
            console.log('click sub');
        };

        return {
            isHideSubMenu,
            toggleSubmenu,
            submenu,
            submenus,
            selectSub,
            selectSubInSub,
            checkActiveSubmenu,
        };
    },
});
</script>

<style lang="scss" scoped>
.collapse__button {
    width: 24px;
    height: 24px;
    outline: none;
    background-color: #ffffff;
    &:focus {
        border-color: transparent;
    }
}
.submenu__wrapper {
    height: calc(100vh - 57px - 56px - 32px - 20px);
    &::-webkit-scrollbar {
        width: 16px;
    }
    &::-webkit-scrollbar-track {
        background: #f6f6f8;
        padding: 0 30px;
        width: 16px;
    }
    &::-webkit-scrollbar-thumb {
        background: #e9e9ec;
        border-radius: 8px;
        border: 4px solid #f6f6f8;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: #b4b4be;
    }
    :deep(.submenu__tooltip) {
        display: block;
        &[data-show-tooltip='false'] {
            :deep(.tooltip-component__inner) {
                visibility: hidden;
            }
        }
    }
}
.arrow {
    border: solid #3f3f49;
    border-width: 0 1.2px 1.2px 0;
    display: inline-block;
    padding: 2.6px;
}
.down {
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
}
.active-expand .arrow {
    border-color: #3e6dda;
}
.mb-8p.mb-3p {
    margin-bottom: 3px;
}
.mb-3p.end-submenu {
    margin-bottom: 8px;
}
</style>
