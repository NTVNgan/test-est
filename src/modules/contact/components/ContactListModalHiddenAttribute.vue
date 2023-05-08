<template>
    <modal-component v-model="showModalSync" :custom-class="'py-32p'" :width="'576px'" :closeIcon="false" class="model-add-contact text-center z-999">
        <template v-slot:body>
            <img class="mt-16p mb-16p logo mx-auto w-120 h-120" src="../images/attribute-hidden.svg" alt="banner" />
            <p class="text-24 font-semibold capitalize font-heading">Hmmm, some attributes have been hidden</p>
            <p class="text-14 my-16p">We're unable to add some attibutes to the filter. <br>Please check your filter again.</p>
            <Button size="medium" @click="reloadPage">
                Got it
            </Button>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch, reactive } from 'vue';
import Button from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';

export default defineComponent({
    name: 'ContactListModalHiddenAttribute',
    components:{
        Button,
        ModalComponent
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
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

        const reloadPage = () => {
            location.reload();
        }

        return {
            showModalSync,
            reloadPage
        }
    }
})
</script>