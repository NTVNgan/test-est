<template>
    <div class="overflow-hidden rounded-4p flex flex-col">
        <table class="min-w-full divide-y divide-gray-200 text-neutrals-900">
            <thead class="bg-neutrals-50">
                <tr>
                    <th style="width: 50px"></th>
                    <th class="p-16p">
                        <skeleton-box width="112px" />
                    </th>
                    <th v-for="index in 2" :key="index" class="p-16p" style="width: 180px">
                        <skeleton-box width="142px" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="indexParent in 11" :key="indexParent">
                    <td style="width: 50px" class="p-16p border-b border-neutrals-100">
                        <skeleton-box
                            width="16px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                    <td class="p-16p border-b border-neutrals-100">
                        <skeleton-box
                            width="208px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                    <td v-for="index in 2" :key="index" class="p-16p border-b border-neutrals-100">
                        <skeleton-box
                            width="56px"
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
    name: 'SettingTeammateTableSkeletonComponent',
    components: {
        SkeletonBox,
    },
});
</script>

<style lang="scss" scoped>
table {
    table-layout: fixed;
    width: 100%;
    th {
        height: 48px;
        white-space: nowrap;
        div {
            display: flex;
            div {
                align-self: center;
            }
        }
    }
    td {
        height: 52px;
    }
    th,
    td {
        vertical-align: inherit;
    }
}
</style>
