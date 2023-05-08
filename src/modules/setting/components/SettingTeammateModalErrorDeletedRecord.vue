<template>
    <modal-component v-model="showModalSync" :custom-class="'py-24p'" :width="'496px'" class="model-add-contact z-999">
        <template v-slot:body>
            <div class="px-24p text-center">
                <div class="px-32p py-16p">
                    <template v-if="recordType == 'edit'">
                        <h1 class="font-heading font-semibold text-24 mb-16p capitalize">Unable To Edit Email</h1>
                        <p class="text-14">This email has been deleted and can't be edited anymore.</p>
                    </template>
                    <template v-else-if="recordType.includes('resend')">
                        <h1 class="font-heading font-semibold text-24 mb-16p capitalize">
                            Unable To Resend The Invitation
                        </h1>
                        <p class="text-14">
                            <template v-if="recordType.includes('_deleted')">
                                This email has been deleted and can't resend the invitation.
                            </template>
                            <!-- <template v-if="type.includes('_activated')">
                                This email has been activated and can't resend the invitation.
                            </template> -->
                        </p>
                    </template>
                </div>
                <Button size="medium" @click="closeModal">
                    <span class="text-14">{{ $t('setting.teammate_modal_edit_activated_email_button') }}</span>
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
        recordType: {
            type: String,
            deafault: 'nothing',
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
