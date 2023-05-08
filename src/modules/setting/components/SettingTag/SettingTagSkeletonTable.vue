<template>
    <div class="overflow-hidden rounded-4p flex flex-col">
        <table class="min-w-full divide-y divide-gray-200 text-neutrals-900 rounded border border-neutrals-100">
            <thead class="bg-neutrals-50">
                <tr>
                    <th style="width: 50px">
                        <div></div>
                    </th>
                    <th class="p-16p p-0">
                        <skeleton-box width="108px" />
                    </th>
                    <th class="p-16p" style="width: 100px">
                        <skeleton-box width="40px" />
                    </th>
                    <th class="p-16p" style="width: 100px">
                        <skeleton-box width="40px" />
                    </th>
                    <th class="p-16p" style="width: 160px">
                        <skeleton-box width="128px" />
                    </th>
                    <th class="p-16p" style="width: 180px">
                        <skeleton-box width="100px" />
                    </th>
                    <th class="p-16p" style="width: 60px">
                        <div></div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="indexParent in 7" :key="indexParent">
                    <td class="px-16p py-23p border-b border-neutrals-100">
                        <skeleton-box
                            width="16px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                    <td class="px-16p py-23p border-b border-neutrals-100">
                        <skeleton-box
                            width="84px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                        <skeleton-box
                            width="181px"
                            class="mt-12p"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                    <td class="px-16p py-23p border-b border-neutrals-100">
                        <skeleton-box
                            width="44px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                    <td class="px-16p py-23p border-b border-neutrals-100">
                        <skeleton-box
                            width="29px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                    <td class="px-16p py-23p border-b border-neutrals-100">
                        <skeleton-box
                            width="128px"
                            :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                        />
                    </td>
                    <td class="px-16p py-23p border-b border-neutrals-100">
                        <div class="flex items-center">
                            <skeleton-box
                                width="20px"
                                height="20px"
                                type="circle"
                                :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                            />
                            <skeleton-box
                                width="113px"
                                class="ml-12p"
                                :classBgColor="indexParent % 2 === 0 ? 'bg-neutrals-50' : 'bg-neutrals-100'"
                            />
                        </div>
                    </td>
                    <td class="px-16p py-23p border-b border-neutrals-100">
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
    name: 'SettingTagSkeletonTable',
    components: {
        SkeletonBox,
    },
});
</script>