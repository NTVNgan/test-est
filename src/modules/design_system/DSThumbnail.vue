<template>
    <div class="py-5 flex justify-around items-center ">
        <div class="flex">
            <div class="mx-4">
                <label for="size" class="block text-sm font-medium text-gray-700">Size</label>
                <select
                    v-model="size"
                    id="size"
                    name="size"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>small</option>
                    <option selected>medium</option>
                    <option>large</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="radius" class="block text-sm font-medium text-gray-700">Radius</label>
                <select
                    v-model="radius"
                    id="radius"
                    name="radius"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>2</option>
                    <option selected>4</option>
                    <option>none</option>
                </select>
            </div>
            <div class="mx-4">
                <label for="border" class="block text-sm font-medium text-gray-700">Border</label>
                <select
                    v-model="border"
                    id="border"
                    name="border"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>true</option>
                    <option selected>false</option>
                </select>
            </div>
        </div>
        <thumbnail-component
            :src="
                image
                    ? 'https://ih1.redbubble.net/image.1922602796.3836/poster,504x498,f8f8f8-pad,600x600,f8f8f8.jpg'
                    : ''
            "
            :size="size"
            :radius="radius"
            :border="border === 'true'"
            :key="compKey"
        />
        <thumbnail-component src=" " :size="size" :radius="radius" :border="border" :key="compKey" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ThumbnailComponent from '@/components/ui/ThumbnailComponent.vue';

export default defineComponent({
    data() {
        return {
            size: 'medium',
            border: true,
            radius: 'none',
            image: true,
            compKey: 0,
        };
    },
    components: {
        ThumbnailComponent,
    },
    watch: {
        image() {
            this.compKey++;
        },
    },
});
</script>
