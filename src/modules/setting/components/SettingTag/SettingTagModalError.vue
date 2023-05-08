<template>
    <modal-alert-component
        v-model:showModal="showModalAlert"
        width="496px"
        :title="$t('setting.tag_modal_error_title')"
        :content="$t('setting.tag_modal_error_content')"
        @onClickButton="reloadPage"
    />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import ModalAlertComponent from '@/components/ui/ModalAlertComponent.vue';

export default defineComponent({
    name: 'SettingTagModalError',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        ModalAlertComponent,
    },
    setup(props, { emit }) {
        const showModalAlert = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const reloadPage = () => {
            location.reload();
        };

        return {
            reloadPage,
            showModalAlert,
        };
    },
})
</script>
