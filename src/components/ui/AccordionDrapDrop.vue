<template>
    <div class="accordion-drap-drop accordion-component">
        <draggable
            class="accordion-drap-drop__item text-left"
            tag="transition-group"
            :component-data="{
                tag: 'div',
                type: 'transition-group',
                name: !drag ? 'flip-list' : null,
            }"
            :list="tabs"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
            item-key="key"
            drag-class="dragging-item"
            ghost-class="destination-item"
            handle=".handle"
        >
            <template #item="{ element }">
                <div
                    :class="[getTabHeaderClass(element, element.key)]"
                    class="accordion-group border border-solid border-neutrals-100 rounded mb-8p last:mb-0p bg-white"
                >
                    <div
                        class="accordion-header flex items-center justify-between h-44 py-12p pl-8p pr-8p"
                        @click="onTabClick($event, element, element.key)"
                    >
                        <div class="accordion-header__label flex items-center flex-1 min-w-0">
                            <span class="icon-label flex items-center justify-center mr-8p handle">
                                <icon-component name="drag" color="neutrals-200" />
                            </span>
                            <h4
                                class="p-accordion-header-text flex-1 truncate text-14 font-bold text-primary-500"
                                v-if="element.props && element.props.header"
                            >
                                {{ element.props.header }}
                            </h4>
                            <div
                                v-if="element.children && element.children.header"
                                :class="move ? 'text-14 text-primary-500 font-bold' : ''"
                            >
                                <component :is="element.children.header"></component>
                            </div>
                            <div
                                @click.prevent="() => true"
                                class="accordion-tools"
                                v-if="element.children && element.children.tool"
                            >
                                <component :is="element.children.tool"></component>
                            </div>
                        </div>
                        <icon-component class="arrow" name="angle-right" :color="'neutrals-200'" />
                    </div>
                    <transition name="toggle-content">
                        <div
                            class="accordion-body px-8p"
                            v-if="lazy ? isTabActive(element.key) : true"
                            v-show="lazy ? true : isTabActive(element.key)"
                        >
                            <div class="accordion-body-details">
                                <component :is="element"></component>
                            </div>
                        </div>
                    </transition>
                </div>
            </template>
        </draggable>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, inject } from 'vue';
import draggable from 'vuedraggable';
import IconComponent from './IconComponent.vue';
export default defineComponent({
    name: 'AccordionDrapDrop',
    display: 'Handle',
    components: {
        draggable,
        IconComponent,
    },
    emits: ['tab-close', 'tab-open', 'update:activeIndex', 'update:activeKey'],
    props: {
        multiple: {
            type: Boolean,
            default: false,
        },
        activeIndex: {
            type: [Number, Array],
            default: null,
        },
        activeKey: {
            type: Array,
            default: () => [],
        },
        lazy: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit, slots }) {
        const drag = ref(false),
            d_activeIndex = ref(props.activeIndex);
        const emitter: any = inject('emitter');
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
                    let timeout: any = null;
                    timeout = setTimeout(() => {
                        emitter.emit('scrollbarResize');
                    }, 500);
                }
            };

        const dragOptions = computed(() => {
            return {
                animation: 300,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost',
            };
        });
        // const tabs = computed(() => {
        //     const tabs: object[] = [];
        //     const list = (slots as any).default().map((content: any, index: number) => {
        //         return Object.assign(content, { key: index + 1 });
        //     });
        //     list.forEach((child: any) => {
        //         tabs.push(child);
        //     });
        //     return tabs;
        // });

        const tabs = ref<any[]>([]);

        const activeKeySync = computed({
            get(): any {
                return props.activeKey;
            },
            set(value: any) {
                emit('update:activeKey', value);
            },
        });

        const getTabListFromSlot = () => {
            activeKeySync.value.forEach((child: any) => {
                (slots as any).default().filter((item: any) => {
                    if (item.props.key == child) {
                        tabs.value.push(item);
                    }
                });
            });
        };

        watch(
            () => tabs.value,
            newVals => {
                activeKeySync.value = newVals.map(item => item.key);
            },
            { deep: true },
        );

        watch(
            () => props.activeIndex,
            data => {
                (d_activeIndex as any).value = data;
            },
        );

        onMounted(() => {
            getTabListFromSlot();
        });
        return {
            drag,
            d_activeIndex,
            isTabActive,
            getKey,
            isTabDisabled,
            isAccordionTab,
            getTabHeaderClass,
            onTabClick,
            dragOptions,
            tabs,
        };
    },
});
</script>

<style lang="scss" scoped>
.accordion-drap-drop {
    &__item {
        width: 100%;
        .is-open {
            .accordion-header {
                .arrow {
                    transform: rotate(90deg);
                    transform-origin: center;
                }
                .accordion-tools {
                    display: block;
                }
            }
        }
        .accordion-header {
            cursor: pointer;
            box-shadow: 0px 6px 20px -10px rgba(0, 0, 0, 0.08);
            .icon-label {
                cursor: grab;
            }
            .accordion-tools {
                display: none;
            }
        }
        .dragging-item {
            background-color: #f6f6f8;
            box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1), 0px 2px 20px rgba(0, 0, 0, 0.1);
        }
        .destination-item {
            background-color: transparent;
            overflow: hidden;
            color: transparent;
            border-color: transparent;
            .accordion-header {
                visibility: hidden;
            }
            .accordion-body {
                visibility: hidden;
            }
        }
    }
}
</style>
