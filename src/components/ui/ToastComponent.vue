<template>
    <teleport to="#toast">
        <div aria-live="assertive" class="fixed z-999 font-body bottom-24p left-24p">
            <transition-group name="slide-fade-right" tag="ul">
                <div
                    class="px-16p flex items-center w-max rounded-8p mt-10p mr-auto"
                    v-for="toast of toasts"
                    :key="toast.id"
                    :class="[toast.type === 'basic' ? 'bg-neutrals-900 py-14p' : 'bg-error-3 py-16p']"
                >
                    <div class="flex-1 text-white flex items-center">
                        <icon-component v-if="toast.icon" :name="toast.icon" :color="toast.iconColor" class="mr-8p" />
                        <p class="text-16 font-normal">{{ toast.title }}</p>
                        <button
                            @click="toast.btnFunction"
                            v-if="toast.btnLabel"
                            class="ml-24p mr-16p text-14 font-medium focus:outline-none"
                        >
                            {{ toast.btnLabel }}
                        </button>
                    </div>
                    <div class="ml-12p flex-shrink-0 flex">
                        <button @click="removeToast(toast.id)" class="bg-transparent inline-flex focus:outline-none">
                            <span class="sr-only">Close</span>
                            <icon-component name="times" color="white" />
                        </button>
                    </div>
                </div>
                <div
                    v-if="toastSingle"
                    class="px-16p flex items-center w-max rounded-8p mt-10p mr-auto"
                    :class="[toastSingle.type === 'basic' ? 'bg-neutrals-900 py-14p' : 'bg-error-3 py-16p']"
                >
                    <div class="flex-1 text-white flex items-center">
                        <icon-component
                            v-if="toastSingle.icon"
                            :name="toastSingle.icon"
                            :color="toastSingle.iconColor"
                            class="mr-8p"
                        />
                        <p class="text-16 font-normal">{{ toastSingle.title }}</p>
                        <button
                            @click="toastSingle.btnFunction"
                            v-if="toastSingle.btnLabel"
                            class="ml-24p mr-16p text-14 font-medium focus:outline-none"
                        >
                            {{ toastSingle.btnLabel }}
                        </button>
                    </div>
                    <div class="ml-12p flex-shrink-0 flex">
                        <button @click="removeToastSingle" class="bg-transparent inline-flex focus:outline-none">
                            <span class="sr-only">Close</span>
                            <icon-component name="times" color="white" />
                        </button>
                    </div>
                </div>
            </transition-group>
        </div>
    </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { useToast } from '@/composables/useToast';

export default defineComponent({
    components: {
        IconComponent,
    },
    setup() {
        const { toasts, toastSingle, removeToast, removeToastSingle } = useToast();
        return {
            toasts,
            toastSingle,
            removeToast,
            removeToastSingle,
        };
    },
});
</script>

<style lang="scss"></style>
