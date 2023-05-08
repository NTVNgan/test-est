<template>
    <modal-component
        v-model="showModalSync"
        :custom-class="'py-24p'"
        :width="!isArchiveSuccess ? '560px' : '560px'"
        class="z-999"
        :closeIcon="!isArchiveSuccess"
    >
        <template v-if="!isArchiveSuccess" v-slot:header>
            <div class="flex">
                <icon-component class="mr-4p" name="InfoCircle" color="error-3" />
                <span class="font-medium text-16"
                    >{{ $t('contact.contact_archive_modal_title') }} {{ total == 1 ? 'this' : total }}
                    {{ $t('contact.contact_archive_modal_title_contact') }}{{ total > 1 ? 's' : '' }}?</span
                >
            </div>
        </template>
        <template v-slot:body>
            <div v-if="isArchiveSuccess" class="px-24p pt-8p mx-auto text-center">
                <div class="font-semibold font-heading text-24">
                    {{ $t('contact.contact_archive_process_modal_title') }}
                </div>
                <div class="text-14 my-16p" v-html="$t('contact.contact_archive_process_modal_description')"></div>
                <Button size="medium" @click="closeModal">
                    {{ $t('contact.contact_archive_process_modal_button') }}
                </Button>
            </div>
            <div
                v-else
                class="px-24p py-16p text-center text-14"
                v-html="
                    total == 1
                        ? $t('contact.contact_archive_process_modal_success_description_single')
                        : $t('contact.contact_archive_process_modal_success_description')
                "
            ></div>
        </template>
        <template v-if="!isArchiveSuccess" v-slot:footer>
            <div class="flex justify-end">
                <Button class="mr-8p" type="outline" size="medium" @click="closeModal">
                    {{ $t('contact.contact_archive_process_modal_button_cancel') }}
                </Button>
                <Button size="medium" type="destructive" @click="onSubmit">
                    {{ $t('contact.contact_archive_modal_title') }}
                </Button>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch, onMounted } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { useContact } from '@/modules/contact/composables/useContact';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'ContactListModalArchiveContact',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Object,
        },
        hasFilter: {
            type: Boolean,
            deafeault: false,
        },
        total: {
            type: Number,
        },
    },
    components: {
        Button,
        IconComponent,
        ModalComponent,
    },
    setup(props, { emit }) {
        // const invalidCustomerId = ref<boolean>(false);
        const { t } = useI18n();
        const emitter: any = inject('emitter');
        const { updateContactsToArchive } = useContact();
        const isArchiveSuccess = ref<boolean>(false);
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
            window.setTimeout(() => (isArchiveSuccess.value = false), 500);
        };

        const onSubmit = async () => {
            try {
                const res = await updateContactsToArchive(props.data, props.hasFilter);
                emit('archive-success');
                isArchiveSuccess.value = true;
            } catch (e) {
                console.log('error archive contact :', e);
            }
        };

        return {
            showModalSync,
            closeModal,
            onSubmit,
            isArchiveSuccess,
        };
    },
});
</script>

<style lang="scss" scoped></style>
