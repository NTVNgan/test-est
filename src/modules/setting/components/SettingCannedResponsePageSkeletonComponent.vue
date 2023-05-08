<template>
    <div class="overflow-hidden rounded-4p flex flex-col px-40p py-36p relative">
        <div class="mb-50p">
            <skeleton-box width="205px" :classBgColor="'bg-neutrals-100'" />
        </div>
        <div class="mb-40p">
            <skeleton-box width="112px" :classBgColor="'bg-neutrals-100'" />
        </div>
        <div class="flex mb-40p">
            <span class="ml-auto">
                <skeleton-box width="100px" :classBgColor="'bg-neutrals-100'" />
            </span>
        </div>
        <div class="flex justify-between items-center mb-48p">
            <span class="mr-8p">
                <skeleton-box width="290px" :classBgColor="'bg-neutrals-100'" />
            </span>
            <span class="mr-8p">
                <skeleton-box width="160px" :classBgColor="'bg-neutrals-100'" />
            </span>
            <span class="mr-8p">
                <skeleton-box width="240px" :classBgColor="'bg-neutrals-100'" />
            </span>
            <span class="mr-8p">
                <skeleton-box width="160px" :classBgColor="'bg-neutrals-100'" />
            </span>
            <span>
                <skeleton-box width="160px" :classBgColor="'bg-neutrals-100'" />
            </span>
        </div>
        <div class="mb-26p">
            <skeleton-box width="72px" :classBgColor="'bg-neutrals-100'" />
        </div>
        <table class="w-full scrollbar-tranparent overflow-hidden rounded-4p">
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
                        width="50px"
                        data-v-6bceb9c4=""
                    ></th>
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
                        width="256px"
                        data-v-6bceb9c4=""
                    >
                        <skeleton-box width="108px" :classBgColor="'bg-neutrals-100'" />
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
                        <skeleton-box width="80px" :classBgColor="'bg-neutrals-100'" />
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
                        <skeleton-box width="128px" :classBgColor="'bg-neutrals-100'" />
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
                        <skeleton-box width="100px" :classBgColor="'bg-neutrals-100'" />
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
                        <skeleton-box width="100px" :classBgColor="'bg-neutrals-100'" />
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
                        width="96px"
                        data-v-6bceb9c4=""
                    >
                        <skeleton-box width="40px" :classBgColor="'bg-neutrals-100'" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="indexParent in 4" :key="indexParent">
                    <td class="p-16p ptb-11p border-b border-neutrals-100">
                        <skeleton-box
                            width="16px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                    <td class="p-16p ptb-11p border-b border-neutrals-100">
                        <skeleton-box
                            width="84px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                        <div class="py-12p">
                            <skeleton-box
                                width="181px"
                                :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                            />
                        </div>
                        <skeleton-box
                            width="40px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                    <td class="p-16p ptb-11p border-b border-neutrals-100">
                        <skeleton-box
                            width="120px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                    <td class="p-16p ptb-11p border-b border-neutrals-100">
                        <skeleton-box
                            width="100px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                    <td class="p-16p ptb-11p border-b border-neutrals-100">
                        <div class="flex items-center">
                            <div class="mr-12p">
                                <skeleton-box
                                    width="20px"
                                    height="20px"
                                    type="circle"
                                    :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                                />
                            </div>
                            <div class="">
                                <skeleton-box
                                    width="100px"
                                    :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                                />
                            </div>
                        </div>
                    </td>
                    <td class="p-16p ptb-11p border-b border-neutrals-100">
                        <skeleton-box
                            width="80px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                    <td class="p-16p ptb-11p border-b border-neutrals-100">
                        <skeleton-box
                            width="16px"
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
    name: 'SettingCannedResponsePageSkeletonComponent',
    components: {
        SkeletonBox,
    },
});
</script>

<style lang="scss" scoped>
table {
    border-spacing: 0px;
    border-collapse: separate;
    border: 1px solid #e9e9ec;

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
