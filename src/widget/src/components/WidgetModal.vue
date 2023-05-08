<template>
    <teleport to="#modal-widget">
        <transition enter-active-class="duration-300" leave-active-class="duration-200">
            <div
                v-show="visible"
                class="widget-modal">
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
                        class="widget-modal__bg"
                    >
                        <div></div>
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
                        class="widget-modal__content"
                        role="dialog"
                        :style="`width:${width}`"
                        aria-modal="true"
                        aria-labelledby="modal-headline"
                    >
                        <!-- <template v-if="!$slots.header">
                            <icon-component
                                class="absolute cursor-pointer z-10"
                                style="right: 29px; top: 21px"
                                v-if="closeIcon"
                                name="times"
                                color="neutrals-400"
                                @click="onCloseModal"
                            ></icon-component>
                        </template> -->
                        <!-- <div class="flex justify-between items-center border-b">
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
                        </div> -->
                        <div
                            class="modal-body relative"
                            :class="[{ 'pb-32p': !$slots.footer }, customClass]"
                            style="max-height: 536px"
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
    </teleport>
</template>

<script lang="ts">
import { defineComponent, computed, onUpdated, onMounted } from 'vue';
// import IconComponent from '@/components/ui/IconComponent.vue';

export default defineComponent({
    name: 'ModalComponent',
    components: {
        // IconComponent,
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
    },
    emits: ['update:modelValue', 'close'],
    setup(props, { emit }) {

        const visible = computed({
            get: () => props.modelValue,
            set: value => {
                emit('update:modelValue', value)
            },
        });

        const htmlBody = () => {
            const bodyHtml = document.getElementsByTagName('body')[0];
            if (visible.value){
                bodyHtml.style.overflow = "hidden";
            } else {
                bodyHtml.style.overflow = "visible";
            }
        }
        
        const onCloseModal = () => {
            emit('update:modelValue', !visible.value);
            emit('close');
            visible.value = !visible.value;
        };

        onUpdated(() => {
            htmlBody();
        });

        onMounted(() => {
            htmlBody();
        })

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
.widget-modal{
    position: fixed;
    padding-bottom: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    &__bg{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        &>*{
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            opacity: .6;
            background-color: #141417;
        }
    }
    &__content{
        box-shadow: 0 2px 20px 0 rgb(0 0 0 / 10%), 0 0 2px 0 rgb(0 0 0 / 10%);
        overflow: hidden;
        border-radius: 4px;
        background-color: #fff;
        transition-property: all;
        --transform-translate-x: 0;
        --transform-translate-y: 0;
        --transform-rotate: 0;
        --transform-skew-x: 0;
        --transform-skew-y: 0;
        --transform-scale-x: 1;
        --transform-scale-y: 1;
        transform: translateX(var(--transform-translate-x)) translateY(var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y));
    }
}
</style>
