<template>
    <transition enter-active-class="duration-300" leave-active-class="duration-200">
        <section
            v-show="visible"
            class="fixed inset-0 z-999 overflow-hidden"
            aria-labelledby="slide-over-title"
            role="dialog"
            aria-modal="true"
        >
            <div class="absolute inset-0 overflow-hidden">
                <transition
                    enter-active-class="duration-300 ease-out opacity-0"
                    enter-to-class="opacity-100"
                    leave-active-class="duration-200 ease-in"
                    leave-class="opacity-100"
                    leave-to-class="opacity-0"
                >
                    <div @click="onCloseModal" v-show="visible" class="fixed inset-0 transition-opacity ">
                        <div class="absolute inset-0 bg-neutrals-900 opacity-60"></div>
                    </div>
                </transition>

                <div
                    class="max-w-full flex fixed inset-y-0 "
                    :class="position === 'right' ? '  right-0 pl-10' : 'left-0 pr-10'"
                >
                    <transition
                        enter-active-class="transform transition ease-in-out duration-500 "
                        :enter-from-class="position === 'left' ? '-translate-x-full' : 'translate-x-full'"
                        enter-to-class="translate-x-0"
                        leave-active-class="transform transition ease-in-out duration-500"
                        :leave-class="position === 'left' ? 'translate-x-full' : 'translate-x-0'"
                        :leave-to-class="position === 'left' ? '-translate-x-full' : `translate-x-full`"
                    >
                        <div class="w-400 text-neutrals-900" v-show="visible">
                            <div class="h-full flex flex-col bg-white shadow-3p overflow-y-hidden">
                                <div class="flex items-center justify-between px-16p py-12p shadow-deep-1">
                                    <span class="text-primary-500 text-16 font-bold" id="slide-over-title">
                                        <slot name="header">
                                            Panel title
                                        </slot>
                                    </span>
                                    <icon-component
                                        name="times"
                                        class="cursor-pointer"
                                        color="neutrals-400"
                                        @click="onCloseModal"
                                    ></icon-component>
                                </div>
                                <scrollbar-component class="drawer__body flex-1 relative">
                                    <div class="p-16p text-14">
                                        <slot name="body">
                                            Body text
                                        </slot>
                                    </div>
                                </scrollbar-component>
                                <div v-if="$slots.footer" class="px-16p py-10p shadow-inner-drop">
                                    <slot name="footer">
                                        Footer
                                    </slot>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </section>
    </transition>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import ScrollbarComponent from '@/components/ui/ScrollbarComponent.vue';

export default defineComponent({
    name: 'DrawerComp',
    components: {
        IconComponent,
        ScrollbarComponent,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        width: {
            type: [String, Number],
            default: '560',
        },
        position: {
            type: String,
            default: 'right',
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const visible = computed({
            get: () => props.modelValue,
            set: value => emit('update:modelValue', value),
        });

        const onCloseModal = () => {
            emit('update:modelValue', !visible.value);
            visible.value = !visible.value;
        };

        return {
            visible,
            onCloseModal,
        };
    },
});
</script>

<style lang="scss" scoped>
.drawer__body {
    height: calc(100% - 104px);
}
</style>
