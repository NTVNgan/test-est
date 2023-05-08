<template>
    <div>
        <modal-component
            v-model="showModalSync"
            :custom-class="'py-24p'"
            :width="'560px'"
            class="model-add-contact z-999"
        >
            <template v-slot:header>
                <div class="flex">
                    <icon-component
                        name="exclamation-circle"
                        class="icon-recently cursor-pointer"
                        color="error-3"
                    />
                    <span
                        class="font-medium text-16 ml-4p"
                    >Hide {{isMoreTextAttributeNumber}}?</span>
                </div>
            </template>
            <template v-slot:body>
                <div class="px-24p py-16p text-center text-14">
                    Other teammates might still be using it.
                    <br />Please check with them to make sure your action.
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <Button
                        class="mr-8p"
                        type="outline"
                        size="medium"
                        @click="closeModalHide"
                    >{{ $t('setting.teammate_modal_edit_email_button_cancel') }}</Button>
                    <Button size="medium" type="destructive" @click="hideAttribute">Hide</Button>
                </div>
            </template>
        </modal-component>
        <modal-component
            v-model="showModalSuccess"
            :closeIcon="false"
            :custom-class="'py-24p'"
            :width="'496px'"
            class="model-add-contact z-999"
        >
            <template v-slot:body>
                <div class="px-24p pt-8p text-center text-14">
                    <p class="text-24 font-semibold capitalize font-heading">
                        {{isMoreTextAttribute}} successfully hidden
                    </p>
                    <p class="text-14 my-16p">We will reload this page for the newest data.</p>
                    <Button size="medium" @click="closeModalSuccess">Got it</Button>
                </div>
            </template>
        </modal-component>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch, onMounted } from 'vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { useAttribute } from '@/modules/setting/composables/useContactAttribute';

export default defineComponent({
    name: 'SettingAttributeHide',
    components: {
        ModalComponent,
        Button,
        IconComponent,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        attribute: {
            type: Array,
            default: () => [],
        },
        countAttributeShow: {
            type: Number,
            default: 0
        },
        keyword: {
            type: String,
            default: null
        },
        auid: {
            type: String,
            default: null
        },
        updated_to:{
            type: String,
            default: null
        },
        updated_from:{
            type: String,
            default: null
        },
    },
    setup(props, { emit }) {
        const { error, errorMessage, loading, changeAttribute } = useAttribute();
        const showModalSuccess = ref<boolean>(false);

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const closeModalHide = () => {
            emit('close');
        };

        const hideAttribute = async () => {
            const listID = props.attribute.length > 0 ? props.attribute : [];
            const res = await changeAttribute({ ids: listID, show: false, keyword: props.keyword, _auid: props.auid, updated_at_from: props.updated_from, updated_at_to: props.updated_to });
            if (!error.value) {
                closeModalHide();
                showModalSuccess.value = true;
            }
        };

        const isMoreTextAttributeNumber = computed(() => {
            if (props.attribute.length > 0){
                if (props.attribute.length > 1){
                    return props.attribute.length+` attributes`
                } else return `attribute`
            } else {
                if (props.countAttributeShow > 1){
                    return props.countAttributeShow + ` attributes`
                } else return props.countAttributeShow + ` attribute`
            }
        })

        const isMoreTextAttribute = computed(() => {
            if (props.attribute.length > 0){
                if (props.attribute.length > 1){
                    return props.attribute.length+` attributes`
                } else return `attribute`
            } else {
                if (props.countAttributeShow > 1){
                    return props.countAttributeShow + ` attributes`
                } else return `attribute`
            }
        }) 

        const closeModalSuccess = () => {
            location.reload();
        };

        return {
            showModalSync,
            closeModalHide,
            hideAttribute,
            showModalSuccess,
            closeModalSuccess,
            isMoreTextAttribute,
            isMoreTextAttributeNumber
        };
    },
});
</script>