<template>
    <div
        class="relative scrollbar--transparent border border-neutrals-100 rounded-4p"
        :class="{ 'table-component__fixed': fixed, [id]: id }"
    >
        <slot v-if="$slots.loading && loading" name="loading"></slot>
        <table-skeleton-component v-else-if="loading" />
        <div
            v-if="columnsData.length > 0 && fixed"
            class="table-component__fixed-col"
            :style="{
                width: columnsData[0].width,
            }"
        ></div>
        <table
            v-show="!loading && columnsData.length > 0"
            class="w-full scrollbar-tranparent overflow-hidden rounded-4p b-r-none"
            :class="tableLayout === 'fixed' ? 'table-fixed' : 'table-auto'"
        >
            <thead class="bg-neutrals-50">
                <tr>
                    <th
                        class="
                            bg-neutrals-50
                            whitespace-nowrap
                            overflow-hidden
                            px-16p
                            py-12p
                            text-16 text-neutrals-500
                            font-bold
                            text-left
                            border-b border-neutrals-100
                        "
                        :class="cellClass"
                        v-for="(item, index) in columnsData"
                        :key="item.dataIndex"
                        :width="item.width"
                        :style="{
                            minWidth: item.minWidth,
                            maxWidth: item.maxWidth,
                        }"
                    >
                        <div class="flex items-center truncate">
                            <div class="mr-32p w-25" v-if="index == 0 && rowSelection">
                                <CheckBoxCustom
                                    v-if="isIndeterminate"
                                    :indeterminate="isIndeterminate"
                                    class="cursor-not-allowed"
                                    :checked="checkAll || isIndeterminate"
                                    @click="onCheckAllChange"
                                />
                            </div>
                            <span class="truncate">
                                <slot :name="item.slots ? item.slots.title : ''">
                                    <template v-if="item.title">{{ item.title }}</template>
                                    <template v-else>
                                        <span class="sr-only">{{ item.key }}</span>
                                    </template>
                                </slot>
                            </span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(item, index) in data"
                    class="transition-all hover:bg-neutrals-50 active:bg-neutrals-100"
                    :key="item[keyData]"
                    :class="{
                        'bg-neutrals-50': checkedList.includes(item[[keyData]]),
                    }"
                >
                    <template v-for="(itemRow, indexRow) in columnsData" :key="`row${itemRow.dataIndex + indexRow}`">
                        <td
                            v-if="indexRow !== 0"
                            class="border-b border-neutrals-100 text-14"
                            :class="itemRow.dataIndex === 'action' ? 'p-8p' : 'truncate px-16p py-12p'"
                            :width="itemRow.width"
                            :style="{
                                minWidth: itemRow.minWidth,
                                maxWidth: itemRow.maxWidth,
                            }"
                        >
                            <div class="block">
                                <TooltipComponent
                                    :content="tooltipContent"
                                    position="top"
                                    type="light"
                                    :disabled="
                                        !toolTipCell && cellHover !== `cellName-${itemRow.dataIndex}-${item[keyData]}`
                                    "
                                    class="truncate "
                                >
                                    <span
                                        :id="`cellName-${itemRow.dataIndex}-${item[keyData]}`"
                                        @mouseover="isEllipsisActive(`cellName-${itemRow.dataIndex}-${item[keyData]}`)"
                                    >
                                        <slot
                                            :name="itemRow.scopedSlots ? itemRow.scopedSlots.customRender : ''"
                                            :dataIndex="itemRow.dataIndex"
                                            :record="item"
                                            :text="item[itemRow.dataIndex]"
                                            :type="itemRow.type ? itemRow.type : null"
                                            >{{ item[itemRow.dataIndex] }}
                                        </slot>
                                    </span>
                                </TooltipComponent>
                            </div>
                        </td>
                        <template v-else>
                            <th
                                class="border-b border-neutrals-100 p-16p pr-0 text-14"
                                :width="columnsData[0].width"
                                :style="{
                                    minWidth: columnsData[0].minWidth,
                                    maxWidth: columnsData[0].maxWidth,
                                }"
                                :class="{
                                    [cellClass]: true,
                                    [checkedList.includes(item[[keyData]])
                                        ? 'bg-neutrals-50'
                                        : 'hover:bg-neutrals-50 active:bg-neutrals-100']: true,
                                    'bg-white': tableLayout === 'fixed',
                                }"
                            >
                                <div class="flex items-center truncate">
                                    <div class="mr-32p" v-if="rowSelection">
                                        <CheckBoxCustom
                                            class="select-none"
                                            value="21"
                                            name="test"
                                            :checked="checkedList.includes(item[[keyData]])"
                                            @click="(e) => onCheckChange(e, item, index)"
                                        />
                                    </div>
                                    <div class="pr-16p truncate flex-grow text-left">
                                        <slot
                                            :name="itemRow.scopedSlots ? itemRow.scopedSlots.customRender : ''"
                                            :dataIndex="itemRow.dataIndex"
                                            :record="item"
                                            :text="item[itemRow.dataIndex]"
                                            >{{ item[itemRow.dataIndex] }}</slot
                                        >
                                    </div>
                                </div>
                            </th>
                        </template>
                    </template>
                </tr>
            </tbody>
        </table>
        <div v-if="loadingRow" class="absolute p-16p w-full h-74 flex justify-center items-center">
            <Spinner size="normal" class="w-24 h-24" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch, provide, inject } from 'vue';
import CheckBoxCustom from '@/components/ui/CheckboxCustom.vue';
import TableSkeletonComponent from '@/components/ui/TableSkeletonComponent.vue';
import Spinner from '@/components/ui/Spinner.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';

export default defineComponent({
    name: 'NewTableComponent',
    components: {
        TooltipComponent,
        TableSkeletonComponent,
        CheckBoxCustom,
        Spinner,
    },
    props: {
        columns: {
            type: Array,
            require: true,
        },
        dataSource: {
            type: Array,
            default: null,
        },
        rowSelection: {
            type: Object,
            default: null,
        },
        keyData: {
            type: String,
        },
        loadingRow: {
            type: Boolean,
            default: false,
        },
        scrollToBottom: {
            type: Function,
            default: null,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        nextPage: {
            type: String,
            default: null,
        },
        fixed: {
            type: Boolean,
            default: false,
        },
        tableLayout: {
            type: String,
            default: 'auto',
        },
        id: {
            type: String,
            default: 'table-component',
        },
        cellClass: {
            type: String,
            default: 'px-16p py-16p',
        },
        toolTipCell: {
            default: false,
        },
    },
    setup(props: any) {
        const status = ref<string>('first_time');
        const checkedList = ref<Array<any>>([]);
        const hoveredRow = ref<any>(null);
        const activedRow = ref<any>(null);
        const cellHover = ref<any>(null);
        const tooltipContent = ref<any>('');
        const checkAll = ref<any>(false);
        // const data = ref(props.dataSource ? props.dataSource : []);
        const data = computed(() => (props.dataSource ? props.dataSource : []));
        const columnsData = computed(() => props.columns);
        const RowKeyComp = ref<number>(0);
        const emitter: any = inject('emitter');
        const isActiveScrollToBottom = ref<any>(false);
        const lastCheckBoxActive = ref<any>(null);
        const onCheckChange = (e: any, item: Array<string>, index: number) => {
            e.preventDefault();
            const shiftKey = e.shiftKey && checkedList.value.length > 0;
            console.log({ item });
            const key: any = props.keyData;
            const keyItem: any = item[key];
            // const itemCheck : string[] = item[props.keyData]
            if (checkedList.value.includes(keyItem)) {
                checkedList.value = checkedList.value.filter((itemChecked) => itemChecked !== keyItem);
            } else {
                const checkedListTemp = JSON.parse(JSON.stringify(checkedList.value));
                checkedListTemp.push(keyItem);
                if (shiftKey && checkedList.value.length > 0) {
                    let temp = index < lastCheckBoxActive.value.index ? index + 1 : lastCheckBoxActive.value.index + 1;
                    if (index < lastCheckBoxActive.value.index) {
                        while (temp < lastCheckBoxActive.value.index) {
                            checkedListTemp.push(data.value[temp][key]);
                            temp++;
                        }
                    } else {
                        while (temp < index) {
                            checkedListTemp.push(data.value[temp][key]);
                            temp++;
                        }
                    }
                }
                checkedList.value = [...new Set(checkedListTemp)];
                lastCheckBoxActive.value = { value: item[key], index };
            }
            checkAll.value = checkedList.value.length === data.value.length;
            // props.rowSelection && props.rowSelection.onChange(checkedList.value);
        };

        const scrollToBottomEventFunc = ({ func, event, table }: any) => {
            // tableLeft.scrollTop = event.target.scrollTop;
            emitter.emit('table-scroll');
            if (func !== null) {
                const maxScroll = event.target.scrollHeight - event.target.clientHeight;
                const currentScroll = event.target.scrollTop;
                const currentScrollLeft = event.target.scrollLeft;
                const targetElement: any = document.getElementsByClassName('table-component__fixed-col')[0];
                if (targetElement) {
                    if (currentScrollLeft !== 0) {
                        targetElement.style.opacity = 1;
                        targetElement.style.height = table.offsetHeight - 10 + 'px';
                    } else {
                        targetElement.style.opacity = 0;
                        targetElement.style.height = 0;
                    }
                }
                if (currentScroll + 5 >= maxScroll) {
                    func();
                }
            }
        };

        const handleScrollToBottom = async (func: any) => {
            const table: any = document.querySelector(`.${props.id}`);

            // TODO: FIX LOADMORE FOR BIG RESOLUTION SCREEN
            table.removeEventListener('scroll', async (event: any) => {
                scrollToBottomEventFunc({ func, table, event });
            });

            table.addEventListener('scroll', async (event: any) => {
                scrollToBottomEventFunc({ func, table, event });
            });
        };

        const isIndeterminate = computed(() => {
            const indeterminate = checkedList.value.length !== 0 && checkedList.value.length <= data.value.length;
            return indeterminate;
        });

        const onCheckAllChange = (e: any) => {
            checkedList.value = [];
        };

        const isEllipsisActive = (id: any) => {
            const e: any = document.getElementById(id);
            const parentEl = e.parentElement;
            if (parentEl.offsetWidth < parentEl.scrollWidth) {
                tooltipContent.value = e.innerText;
                cellHover.value = id;
            }
        };

        onMounted(() => {
            props.scrollToBottom && props.dataSource && handleScrollToBottom(props.scrollToBottom);
        });

        watch(
            () => props.dataSource,
            () => {
                if (status.value === 'first_time') {
                    handleScrollToBottom(props.scrollToBottom);
                }
            },
        );

        if (props.rowSelection) {
            watch(checkedList, () => {
                props.rowSelection && props.rowSelection.onChange(checkedList.value, checkedList.value);
            });

            watch(
                () => props.rowSelection.selectedRowKeys,
                () => {
                    checkedList.value.length !== props.rowSelection.selectedRowKeys.length &&
                        (checkedList.value = props.rowSelection.selectedRowKeys);
                },
            );
        }

        return {
            tooltipContent,
            cellHover,
            checkedList,
            data,
            onCheckChange,
            // handleScrollToBottom,
            hoveredRow,
            activedRow,
            columnsData,
            onCheckAllChange,
            checkAll,
            isIndeterminate,
            status,
            lastCheckBoxActive,
            isEllipsisActive,
        };
    },
});
</script>
<style lang="scss" scoped>
.table-component {
    &__fixed {
        &-col {
            height: calc(100vh - 240px);
            max-height: inherit;
            position: fixed;
            z-index: 2;
            box-shadow: 5px 0px 10px -5px rgb(0 0 0 / 10%);
            opacity: 0;
        }
        table {
            max-height: inherit;
            overflow-x: auto;
            white-space: nowrap;
            margin: 0;
            border-collapse: separate;
            border-spacing: 0;
            // table-layout: fixed;
        }
        table thead th {
            position: sticky;
            top: 0;
            z-index: 1;
            // background: white;
        }
        table thead th:not(:first-child) {
            width: 160px;
            max-width: 240px;
        }

        table tbody tr {
            &:hover {
                background: #f6f6f8;
                th {
                    background: #f6f6f8;
                }
            }
            &:active {
                background: #e9e9ec;
                th {
                    background: #e9e9ec;
                }
            }
        }

        table tbody th {
            position: relative;
            z-index: 2;
        }
        table thead th:first-child {
            position: sticky;
            left: 0;
            z-index: 3;
        }
        table tbody th {
            position: sticky;
            left: 0;
            z-index: 2;
        }
    }
    table {
        max-height: inherit;
        overflow-x: auto;
        white-space: nowrap;
        margin: 0;
        border-collapse: separate;
        border-spacing: 0;
        // table-layout: fixed;
    }

    table thead th {
        position: sticky;
        top: 0;
        z-index: 1;
        // background: white;
    }
}
</style>
