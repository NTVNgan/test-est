<template>
    <div class="relative w-full h-relative flex">
        <table-skeleton-component v-if="loading" />

        <div
            class="table-component overflow-hidden border border-neutrals-100 rounded-4p flex flex-col"
            v-show="!loading"
        >
            <!-- <div class="m-table-head" style="overflow-y: scroll; overflow-x: hidden">
                <table class="min-w-full divide-y divide-gray-200 text-neutrals-900">
                    <colgroup>
                        <col v-for="(item, index) in columnsData" :key="index" />
                    </colgroup>
                </table>
            </div> -->
            <div
                class="m-table-body relative scrollbar--transparent"
                style="overflow-y: scroll; overflow-x: auto;"
            >
                <table class="min-w-full divide-y divide-gray-200 text-neutrals-900">
                    <colgroup>
                        <col v-for="(item, index) in columnsData" :key="index" />
                    </colgroup>
                    <thead class="bg-neutrals-50">
                        <tr>
                            <th
                                v-if="rowSelection"
                                scope="col"
                                class="
                                    px-16p
                                    py-12p
                                    text-16 text-neutrals-500
                                    font-bold
                                    text-left
                                    border-b border-neutrals-100
                                "
                            ></th>
                            <th
                                style="white-space: nowrap"
                                class="
                                    whitespace-nowrap
                                    overflow-hidden
                                    px-16p
                                    py-12p
                                    text-16 text-neutrals-500
                                    font-bold
                                    text-left
                                    border-b border-neutrals-100
                                "
                                v-for="item in columnsData"
                                :key="item.dataIndex"
                                :width="item.width ? item.width : '150px'"
                            >
                                <slot :name="item.slots ? item.slots.title : ''">
                                    <template v-if="item.title">{{ item.title }}</template>
                                    <template v-else>
                                        <span class="sr-only">{{ item.key }}</span>
                                    </template>
                                </slot>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            class="transition-all hover:bg-neutrals-50 active:bg-neutrals-100"
                            v-for="(item, index) in data"
                            :class="{
                                'bg-neutrals-50': checkedList.includes(item[[keyData]]),
                                'bg-neutrals-50': hoveredRow === index,
                                'bg-neutrals-100': activedRow === index,
                            }"
                            :key="index"
                        >
                            <td v-if="rowSelection" class="border-b border-neutrals-100 p-16p text-center">
                                <div class="flex justify-center">
                                    <checkbox-component
                                        class="cursor-pointer"
                                        type="checkbox"
                                        :checked="checkedList.includes(item[[keyData]])"
                                        @change="onCheckChange(item)"
                                    />
                                </div>
                                <!-- <input
                            type="checkbox"
                            :checked="checkedList.includes(item[[keyData]])"
                            @change="onCheckChange(item)"
                            />-->
                            </td>
                            <td
                                style="white-space: nowrap"
                                class="
                                    whitespace-nowrap
                                    overflow-hidden
                                    border-b border-neutrals-100
                                    p-16p
                                    whitespace-nowrap
                                    text-sm
                                    font-medium
                                "
                                v-for="(itemRow, indexRow) in columnsData"
                                :key="`row${itemRow.dataIndex + indexRow}`"
                                :width="itemRow.width"
                            >
                                <slot
                                    :name="itemRow.scopedSlots ? itemRow.scopedSlots.customRender : ''"
                                    :dataIndex="itemRow.dataIndex"
                                    :record="item"
                                    :text="item[itemRow.dataIndex]"
                                    >{{ item[itemRow.dataIndex] }}</slot
                                >
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="loadingRow" class="absolute p-16p w-full h-74 flex justify-center">
                    <Spinner size="normal" class="w-24 h-24" />
                </div>
            </div>
            <div v-if="$slots.footer" class="p-16p border-t border-neutrals-100">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import CheckboxComponent from '@/components/ui/CheckboxComponent.vue';
import TableSkeletonComponent from '@/components/ui/TableSkeletonComponent.vue';
import Spinner from '@/components/ui/Spinner.vue';

export default defineComponent({
    name: 'TableComponent',
    components: {
        TableSkeletonComponent,
        CheckboxComponent,
        Spinner,
    },
    props: {
        columns: {
            type: Array,
            require: true,
        },
        dataSource: {
            type: Array,
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
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const checkedList = ref<Array<any>>([]);
        const hoveredRow = ref<any>(null);
        const activedRow = ref<any>(null);
        // const data = ref(props.dataSource ? props.dataSource : []);
        const columnsData = computed(() => props.columns);
        const onCheckChange = (item: Array<string>) => {
            const key: any = props.keyData;
            const keyItem: any = item[key];
            // const itemCheck : string[] = item[props.keyData]
            if (checkedList.value.includes(keyItem)) {
                checkedList.value = checkedList.value.filter((itemChecked) => itemChecked !== keyItem);
            } else checkedList.value.push(keyItem);

            props.rowSelection && props.rowSelection.onChange(checkedList.value);
        };

        const handleScrollToBottom = (func: any) => {
            const table: any = document.querySelector('.m-table-body');
            // const tableLeft: any = document.querySelector('.m-table-body--left');

            // tableLeft.addEventListener('scroll', async (event: any) => {
            //     if (table.scrollTop !== event.target.scrollTop) table.scrollTop = event.target.scrollTop;
            // });

            table.addEventListener('scroll', async (event: any) => {
                // tableLeft.scrollTop = event.target.scrollTop;
                const maxScroll = event.target.scrollHeight - event.target.clientHeight;
                const currentScroll = event.target.scrollTop;
                if (currentScroll == maxScroll) {
                    func();
                }
            });
        };

        const data = computed(() => (props.dataSource ? props.dataSource : []));

        onMounted(() => {
            props.scrollToBottom && handleScrollToBottom(props.scrollToBottom);
        });

        return {
            checkedList,
            data,
            onCheckChange,
            handleScrollToBottom,
            hoveredRow,
            activedRow,
            columnsData,
        };
    },
});
</script>

<style lang="scss" scoped>
.table-component {
    max-height: inherit;
    font-size: 14px !important;
    position: relative;
    &__title {
    }
    &__checked-action {
        text-align: left !important;
    }
    .m-table-head {
        min-height: 48px;
        &::-webkit-scrollbar {
            width: 16px;
        }
        &::-webkit-scrollbar-track {
            opacity: 1;
            background: #f6f6f8;
            padding: 0 30px;
            width: 16px;
        }
    }
    table {
        table-layout: fixed;
        width: 100%;
        thead {
            .a-checkbox-checked {
                transform: translateX(4px);
            }
        }

        th {
            height: 49px;
            white-space: nowrap;
            div {
                display: flex;
                div {
                    align-self: center;
                }
            }
        }
        td {
            height: 74px;
        }
        tr:not(:last-child) {
        }
        tr:hover {
        }
        th,
        td {
            vertical-align: inherit;
        }
    }
    &__row--select {
        td:first-child {
            -webkit-box-shadow: inset 4px 0 0 0 #2f43d7;
            box-shadow: inset 4px 0 0 0 #2f43d7;
        }
    }
    &--float-left {
        position: absolute;
        top: 0;
        z-index: 1;
        overflow: hidden;
        border-radius: 0;
        transition: box-shadow 0.3s ease;
    }
    &__row--header {
    }
}
</style>
