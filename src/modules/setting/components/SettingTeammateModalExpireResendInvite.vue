<template>
    <modal-component v-model="showModalSync" :custom-class="'py-24p'" :width="'496px'" class="model-add-contact z-999">
        <template v-slot:body>
            <div class="px-24p text-center">
                <div class="px-32p py-16p">
                    <h1 class="font-heading font-semibold text-24 mb-16p capitalize">
                        {{$t('setting.teammate_modal_expire_activated_email_title')}}
                    </h1>
                    <p class="text-14">
                         {{$t('setting.teammate_modal_expire_activated_email_description')}}
                    </p>
                </div>
                <Button size="medium" @click="closeModal">
                    <span class="text-14">{{ $t('setting.teammate_modal_maximum_button') }}</span>
                </Button>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import Button from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';

export default defineComponent({
    name: 'SettingTeammateMaximumTeammate',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        Button,
        ModalComponent,
    },
    setup(props, { emit }) {
        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });
        const closeModal = async () => {
            emit('close');
        };
        return {
            showModalSync,
            closeModal,
        };
    },
});
</script>

<style lang="scss" scoped></style>
