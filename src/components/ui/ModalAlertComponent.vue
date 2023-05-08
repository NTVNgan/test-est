<template>
    <teleport to="#modal">
        <modal-component
            v-model="showModalSync"
            customClass="py-32p"
            :width="width"
            :closeIcon="false"
            class="modal-alert z-1000"
        >
            <template v-slot:body>
                <div class="px-24p text-center font-body">
                    <div class="px-32p mb-16p">
                        <h1 class="font-heading font-semibold text-24 mb-16p capitalize">
                            {{ title }}
                        </h1>
                        <p class="text-14" v-html="content"></p>
                    </div>
                    <Button size="medium" @click="onClickButton">
                        <span class="text-14">{{ buttonText }}</span>
                    </Button>
                </div>
            </template>
        </modal-component>
    </teleport>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import Button from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';

export default defineComponent({
    name: 'ModalAlertComponent',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        width: {
            type: String,
            default: '496px',
        },
        title: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            default: '',
        },
        buttonText: {
            type: String,
            default: 'Got it',
        },
    },
    components: {
        Button,
        ModalComponent,
    },
    emits: ['onClickButton', 'update:showModal'],
    setup(props, { emit }) {
        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });
        const onClickButton = async () => {
            emit('onClickButton');
        };
        return {
            showModalSync,
            onClickButton,
        };
    },
});
</script>

<style lang="scss" scoped></style>
