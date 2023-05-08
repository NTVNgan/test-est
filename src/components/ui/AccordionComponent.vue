<template>
    <div class="accordion-component">
        <div
            v-for="(tab, i) of tabs"
            :key="getKey(tab, i)"
            :class="[classCssBorder, getTabHeaderClass(tab, i)]"
            class="accordion-component__item text-left"
        >
            <div
                class="accordion-header flex items-center justify-between"
                :class="classCssHeader"
                @click="onTabClick($event, tab, i)"
                v-if="typeof tab.props.count !== 'undefined' ? tab.props.count > 0 : true"
            >
                <div class="accordion-header__label flex items-center">
                    <span
                        v-if="tab.props && tab.props.icon"
                        class="icon-label bg-primary-50 flex items-center justify-center rounded-50% mr-8p"
                    >
                        <icon-component :name="tab.props.icon" color="primary-500" />
                    </span>
                    <h4
                        class="p-accordion-header-text"
                        :class="[fontWeightHeader, fontSizeHeader]"
                        v-if="tab.props && tab.props.header"
                    >
                        {{ tab.props.header }}
                    </h4>
                    <div v-if="tab.children && tab.children.header">
                        <component :is="tab.children.header"></component>
                    </div>
                </div>
                <div class="icon-header-accordion" v-if="tab.children && tab.children.icon">
                    <component :is="tab.children.icon"></component>
                </div>
                <icon-component class="arrow" name="angle-right" :color="'neutrals-900'" />
            </div>
            <transition name="toggle-content-accordion">
                <div class="accordion-body" v-if="lazy ? isTabActive(i) : true" v-show="lazy ? true : isTabActive(i)">
                    <div class="accordion-body-details" :class="[noBorder ? 'p-8p' : 'py-16p px-12p']">
                        <component :is="tab"></component>
                    </div>
                    <div v-show="typeof tab.props.loading !== 'undefined' && tab.props.loading" class="lg:text-center">
                        <Spinner size="normal" class="w-24 h-24" />
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import IconComponent from './IconComponent.vue';
import Spinner from '@/components/ui/Spinner.vue';

export default defineComponent({
    name: 'Accordion Component',
    components: {
        IconComponent,
        Spinner,
    },
    emits: ['tab-close', 'tab-open', 'update:activeIndex'],
    props: {
        multiple: {
            type: Boolean,
            default: false,
        },
        activeIndex: {
            type: [Number, Array],
            default: null,
        },
        lazy: {
            type: Boolean,
            default: false,
        },
        noBorder: {
            type: Boolean,
            default: false,
        },
        delayTime: {
            type: Boolean,
            default: false,
        },
        fontWeightHeader: {
            type: String,
            default: 'font-medium',
        },
        fontSizeHeader: {
            type: String,
            default: 'text-14',
        },
        watchIndex: {
            type: Boolean,
            default: true,
        },
    },
    setup(props, { emit, slots }) {
        const classCssBorder = computed(() => {
            if (props.noBorder) {
                return 'mb-4p';
            } else {
                return 'border border-solid border-neutrals-200 mb-8p rounded last:mb-0p';
            }
        });

        const classCssHeader = computed(() => {
            if (props.noBorder) {
                return 'py-8p pl-8p pr-2p rounded hover:bg-neutrals-50';
            } else {
                return 'py-16p px-12p shadow-innner-accordion-header hover:text-primary-500';
            }
        });

        const d_activeIndex = ref(props.activeIndex);
        watch(
            () => props.activeIndex,
            (data) => {
                if (props.watchIndex) {
                    (d_activeIndex as any).value = data;
                }
            },
        );

        const ariaId = computed(() => {
            const lastId = 0;
            return `pv_id_${lastId}`;
        });

        const isTabActive = (index: any) => {
                if (props.multiple) return d_activeIndex.value && (d_activeIndex as any).value.includes(index);
                else return index === d_activeIndex.value;
            },
            getKey = (tab: any, i: number) => {
                return tab.props && tab.props.header ? tab.props.header : i;
            },
            isTabDisabled = (tab: any) => {
                return tab.props && tab.props.disabled;
            },
            isAccordionTab = (child: any) => {
                return child.type.name === 'AccordionTab';
            },
            getTabHeaderClass = (tab: any, i: number) => {
                return { 'is-open': isTabActive(i), 'is-disabled': isTabDisabled(tab) };
            },
            onTabClick = (event: any, tab: any, i: number) => {
                if (!isTabDisabled(tab)) {
                    const active = isTabActive(i);
                    const eventName = active ? 'tab-close' : 'tab-open';
                    if (props.multiple) {
                        if (active) {
                            d_activeIndex.value = (d_activeIndex as any).value.filter((index: number) => index !== i);
                        } else {
                            if (d_activeIndex.value) (d_activeIndex as any).value.push(i);
                            else (d_activeIndex as any).value = [i];
                        }
                    } else {
                        (d_activeIndex as any).value = (d_activeIndex as any).value === i ? null : i;
                    }
                    emit('update:activeIndex', d_activeIndex);
                    emit(eventName, {
                        originalEvent: event,
                        index: i,
                    });
                }
            };
        // getHeight = async (el: any) => {
        //     for (let step = 0; step < 5; step++) {
        //         console.log('el');
        //         await new Promise((resolve) => setTimeout(resolve, 500));
        //         el.style.height = el.scrollHeight + 'px';
        //     }
        // };
        // beforeEnter = (el: any) => {
        //     el.style.height = '0';
        // },
        // enter = (el: any) => {
        //     if (props.delayTime) getHeight(el);
        //     el.style.height = el.scrollHeight + 'px';
        // },
        // beforeLeave = (el: any) => {
        //     el.style.height = el.scrollHeight + 'px';
        // },
        // leave = (el: any) => {
        //     el.style.height = '0';
        // };

        const tabs = computed(() => {
            const tabs: object[] = [];
            (slots as any).default().forEach((child: any) => {
                if (isAccordionTab(child)) {
                    console.log('child', child);
                    tabs.push(child);
                } else if (child.children.length > 0) {
                    child.children.forEach((nestedChild: any) => {
                        // tabs.push(nestedChild);
                        if (isAccordionTab(nestedChild)) {
                            console.log('nestedChild', nestedChild);
                            tabs.push(nestedChild);
                        }
                    });
                }
            });
            return tabs;
        });

        return {
            classCssBorder,
            d_activeIndex,
            ariaId,
            isTabActive,
            getKey,
            isTabDisabled,
            getTabHeaderClass,
            onTabClick,
            tabs,
            isAccordionTab,
            // beforeEnter,
            // enter,
            // beforeLeave,
            // leave,
            classCssHeader,
        };
    },
});
</script>

<style lang="scss" scoped>
.accordion-component {
    &__item {
        width: 100%;
        &.is-open {
            border-color: #3e6dda;
            .accordion-header {
                .arrow {
                    transform: rotate(90deg);
                    margin-right: 2px;
                }
            }
        }
        .accordion-header {
            cursor: pointer;
            .icon-label {
                width: 30px;
                height: 30px;
            }
            .icon-header-accordion {
                margin-right: 9px;
                flex: 1;

                :deep(.tooltip__title) {
                    float: right;
                }
            }
        }
        // .accordion-body {
        //     transition: all 150ms ease-in-out;
        //     overflow: hidden;
        // }
    }
}
</style>
