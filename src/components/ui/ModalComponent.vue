<template>
    <transition enter-active-class="duration-300" leave-active-class="duration-200">
        <div
            v-show="visible"
            class="
                fixed
                bottom-0
                inset-x-0
                px-4
                pb-4
                sm:inset-0
                sm:flex
                sm:items-center
                sm:justify-center
                text-neutrals-900
                z-999
            "
        >
            <transition
                enter-active-class="duration-300 ease-out opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="duration-200 ease-in"
                leave-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div
                    @click="confirm ? onCloseModal : () => true"
                    v-show="visible"
                    class="fixed inset-0 transition-opacity"
                >
                    <div class="absolute inset-0 bg-neutrals-900 opacity-60"></div>
                </div>
            </transition>

            <transition
                enter-active-class="duration-300 ease-out translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
                enter-to-class="translate-y-0 opacity-100 sm:scale-100"
                leave-active-class="duration-200 ease-in"
                leave-class="translate-y-0 opacity-100 sm:scale-100"
                leave-to-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
            >
                <div
                    v-show="visible"
                    class="bg-white rounded-4p overflow-hidden shadow-2p transform transition-all"
                    role="dialog"
                    :style="`width:${width}`"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    <template v-if="!$slots.header">
                        <icon-component
                            class="absolute cursor-pointer z-10"
                            style="right: 29px; top: 21px"
                            v-if="closeIcon"
                            name="times"
                            color="neutrals-400"
                            @click="onCloseModal"
                        ></icon-component>
                    </template>
                    <div v-else class="flex justify-between items-center border-b">
                        <div class="inline-block px-24p py-16p">
                            <slot name="header"></slot>
                        </div>
                        <div class="px-24p py-18p">
                            <icon-component
                                v-if="closeIcon"
                                color="neutrals-400"
                                @click="onCloseModal"
                                class="cursor-pointer"
                                name="times"
                            ></icon-component>
                        </div>
                    </div>
                    <div
                        class="modal-body relative"
                        :class="[{ 'pb-32p': !$slots.footer }, customClass]"
                        :style="`max-height:${maxHeight}`"
                    >
                        <slot name="body"> </slot>
                    </div>
                    <div v-if="$slots.footer" class="px-24p py-10p bg-neutrals-50">
                        <slot name="footer"> </slot>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';

export default defineComponent({
    name: 'ModalComponent',
    components: {
        IconComponent,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        width: {
            type: [String, Number],
            default: '560px',
        },
        customClass: {
            type: String,
            default: 'py-40p',
        },
        closeIcon: {
            type: Boolean,
            default: true,
        },
        confirm: {
            type: Boolean,
            default: false,
        },
        maxHeight: {
            type: String,
            default: '536px',
        },
    },
    emits: ['update:modelValue', 'close'],
    setup(props, { emit }) {
        const visible = computed({
            get: () => props.modelValue,
            set: value => emit('update:modelValue', value),
        });

        const onCloseModal = () => {
            emit('update:modelValue', !visible.value);
            emit('close');
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
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
