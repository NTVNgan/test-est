<template>
    <div class="overflow-hidden rounded-4p flex flex-col" :class="{ 'border border-neutrals-100': isBorder }">
        <table class="min-w-full divide-y divide-gray-200 text-neutrals-900">
            <thead class="bg-neutrals-50">
                <tr>
                    <th class="p-16p" style="width: 320px">
                        <skeleton-box width="120px" />
                    </th>
                    <th v-for="index in 4" :key="index" class="p-16p">
                        <skeleton-box width="96px" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="indexParent in 10" :key="indexParent">
                    <td class="p-16p border-b border-neutrals-100">
                        <div class="flex items-center">
                            <div class="mr-12p">
                                <skeleton-box
                                    width="40px"
                                    height="40px"
                                    type="circle"
                                    :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                                />
                            </div>
                            <div class="">
                                <skeleton-box
                                    width="86px"
                                    :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                                />
                                <skeleton-box
                                    width="187px"
                                    class="mt-12p"
                                    :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                                />
                            </div>
                        </div>
                    </td>
                    <td v-for="index in 4" :key="index" class="p-16p border-b border-neutrals-100">
                        <skeleton-box
                            width="80px"
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
    name: 'TableSkeletonComponent',
    props: {
        isBorder: {
            default:false
        }
    },
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
</style>