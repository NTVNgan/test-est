<template>
    <div class="overflow-hidden rounded-4p flex flex-col">
        <table class="w-full scrollbar-tranparent overflow-hidden rounded-4p b-r-none">
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
                        width="255px"
                        data-v-6bceb9c4=""
                    >
                        <div class="flex items-center" data-v-6bceb9c4=""><!--v-if-->File name</div>
                    </th>
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
                        width="152px"
                        data-v-6bceb9c4=""
                    >
                        <div class="flex items-center" data-v-6bceb9c4=""><!--v-if-->Date created</div>
                    </th>
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
                        width="240px"
                        data-v-6bceb9c4=""
                    >
                        <div class="flex items-center" data-v-6bceb9c4=""><!--v-if-->Imported by</div>
                    </th>
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
                        width="128px"
                        data-v-6bceb9c4=""
                    >
                        <div class="flex items-center" data-v-6bceb9c4=""><!--v-if-->New contact</div>
                    </th>
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
                        width="160px"
                        data-v-6bceb9c4=""
                    >
                        <div class="flex items-center" data-v-6bceb9c4=""><!--v-if-->Updated contact</div>
                    </th>
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
                        width="104px"
                        data-v-6bceb9c4=""
                    >
                        <div class="flex items-center" data-v-6bceb9c4=""><!--v-if-->Error</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="indexParent in 10" :key="indexParent">
                    <td class="p-16p ptb-11p border-b border-neutrals-100">
                        <skeleton-box
                            width="160px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                    <td class="p-16p ptb-11p border-b border-neutrals-100">
                        <skeleton-box
                            width="104px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                    <td class="p-16p ptb-11p border-b border-neutrals-100">
                        <div class="flex items-center">
                            <div class="mr-12p">
                                <skeleton-box
                                    width="32px"
                                    height="32px"
                                    type="circle"
                                    :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                                />
                            </div>
                            <div class="">
                                <skeleton-box
                                    width="104px"
                                    :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                                />
                            </div>
                        </div>
                    </td>
                    <td v-for="index in 3" :key="index" class="p-16p ptb-11p border-b border-neutrals-100">
                        <skeleton-box
                            width="32px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SettingImportHistoryTableSkeletonComponent',
    components: {
        SkeletonBox,
    },
});
</script>

<style lang="scss" scoped>
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
        height: 63px;
    }
    tr:not(:last-child) {
    }
    tr:hover {
    }
    th,
    td {
        vertical-align: inherit;
    }

    .ptb-11p {
        padding-top: 11px;
        padding-bottom: 10px;
    }
}
</style>
