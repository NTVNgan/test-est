<template>
    <!-- This example requires Tailwind CSS v2.0+ -->
    <div class="h-screen flex overflow-hidden bg-gray-100">
        <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->

        <!-- Static sidebar for desktop -->
        <div class="hidden md:flex md:flex-shrink-0">
            <div class="flex flex-col">
                <!-- Sidebar component, swap this element with another sidebar if you like -->
                <div class="flex flex-col h-0 flex-1 bg-gray-800">
                    <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div class="flex items-center flex-shrink-0 px-4">
                            <div class="flex flex-shrink-0 px-2 text-2xl font-semibold text-white">
                                Design System List
                            </div>
                        </div>
                        <nav class="mt-5 flex-1 px-2 bg-gray-800 space-y-1">
                            <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                            <router-link
                                v-for="item in compList"
                                :key="item.path"
                                :to="`/design-system/${item.path}`"
                                :class="item.name === route.name ? sidebarItemClass.active : sidebarItemClass.inactive"
                            >
                                <!-- Current: "text-gray-500", Default: "text-gray-400 group-hover:text-gray-500" -->
                                <!-- Heroicon name: outline/home -->
                                {{ item.name }}
                            </router-link>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col w-0 flex-1 overflow-hidden">
            <main class="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabindex="0">
                <div class="py-6">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 class="text-2xl font-bold text-gray-900">{{ route.name }}</h1>
                    </div>
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <!-- Replace with your content -->
                        <div class="py-4">
                            <div class="border-4 border-dashed border-gray-200 rounded-lg h-96">
                                <transition-router-view />
                            </div>
                        </div>
                        <!-- /End replace -->
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script lang="ts">
import TransitionRouterView from '@/components/TransitionRouterView.vue';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { DSRouterLink } from '@/types/router-name';

export default defineComponent({
    name: 'DSLayouts',
    components: {
        TransitionRouterView,
    },
    setup() {
        const route = useRoute();
        const compList = ref<DSRouterLink[]>([
            {
                name: 'Demo',
                path: 'demo',
            },
            {
                name: 'Scrollbar',
                path: 'scrollbar',
            },
            {
                name: 'Avatar',
                path: 'avatar',
            },
            {
                name: 'Input',
                path: 'input',
            },
            {
                name: 'Input Tiptap',
                path: 'input-tiptap',
            },
            {
                name: 'Checkbox',
                path: 'checkbox',
            },
            {
                name: 'Button',
                path: 'button',
            },
            {
                name: 'Button Group',
                path: 'button-group',
            },
            {
                name: 'Card',
                path: 'card',
            },
            {
                name: 'ColorPicker',
                path: 'colorpicker',
            },
            {
                name: 'Alert',
                path: 'alert',
            },
            {
                name: 'Thumbnail',
                path: 'thumbnail',
            },
            {
                name: 'Text Field',
                path: 'textfield',
            },
            {
                name: 'Select',
                path: 'select',
            },
            {
                name: 'Tag',
                path: 'tag',
            },
            {
                name: 'Table',
                path: 'table',
            },
            {
                name: 'Toggle',
                path: 'toggle',
            },
            {
                name: 'Dropdown',
                path: 'dropdown',
            },
            {
                name: 'Dropdown New',
                path: 'dropdown2',
            },
            {
                name: 'Pagination',
                path: 'pagination',
            },
            {
                name: 'Accordion',
                path: 'accordion',
            },
            {
                name: 'Modal',
                path: 'modal',
            },
            {
                name: 'Radio',
                path: 'radio',
            },
            {
                name: 'Text Editor',
                path: 'texteditor',
            },
            {
                name: 'Drawer',
                path: 'drawer',
            },
            {
                name: 'Step',
                path: 'step',
            },
            {
                name: 'Slider',
                path: 'slider',
            },
            {
                name: 'Tooltip',
                path: 'tooltip',
            },
            {
                name: 'Badge',
                path: 'badge',
            },
            {
                name: 'Tab',
                path: 'tab',
            },
            {
                name: 'DatePicker',
                path: 'datepicker',
            },
            {
                name: 'Toast',
                path: 'toast',
            },
            {
                name: 'Progress Bar',
                path: 'progress-bar',
            },
            {
                name: 'Dropzone',
                path: 'dropzone',
            },
            {
                name: 'Header',
                path: 'header',
            },
            {
                name: 'Sidebar',
                path: 'sidebar',
            },
            {
                name: 'Submenu',
                path: 'submenu',
            },
            {
                name: 'List',
                path: 'list-group',
            },
        ]);
        const sidebarItemClass = ref({
            active: 'bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md',
            inactive:
                'text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md',
        });

        compList.value.sort(function (a, b) {
            const textA = a.name.toUpperCase();
            const textB = b.name.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        return {
            // userProfile,
            compList,
            route,
            sidebarItemClass,
        };
    },
});
</script>
