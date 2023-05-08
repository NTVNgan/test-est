<template>
    <modal-component
        v-model="showModalSync"
        :custom-class="'py-24p'"
        :width="!isDeleteSuccess ? '464px' : '560px'"
        class="z-999"
        :closeIcon="!isDeleteSuccess"
    >
        <template v-if="!isDeleteSuccess" v-slot:header>
            <div class="flex">
                <span class="font-medium text-16">{{ $t('setting.teammate_modal_handover_title') }} </span>
            </div>
        </template>
        <template v-slot:body>
            <div v-if="!isDeleteSuccess">
                <div
                    class="w-300 mb-24p mx-auto text-14 text-center"
                    v-html="$t('setting.teammate_modal_handover_description', { value: value ? value.full_name : '' })"
                ></div>
                <input-comp
                    class="flex-grow w-400 mx-auto"
                    v-model="searchValue"
                    closeIcon
                    placeholder="Search teammate"
                >
                    <template v-slot:prefix>
                        <icon-comp name="search"></icon-comp>
                    </template>
                </input-comp>
                <div class="px-32p h-270 modal-handover-teammate__list overflow-y-auto scrollbar--transparent">
                    <template v-if="teammatesDisplay.length > 0 && value">
                        <div
                            v-for="(record, index) in teammatesDisplay"
                            :key="record.id"
                            class="
                                w-400
                                transition-all
                                whitespace-nowrap
                                overflow-hidden
                                flex
                                items-center
                                p-16p
                                cursor-pointer
                                hover:bg-neutrals-50
                            "
                            @mouseover="hoverTeammateId = record.id"
                            @mouseleave="hoverTeammateId = null"
                            :class="{
                                'border-b border-neutrals-100': index !== teammatesDisplay.length - 1,
                                'justify-between': selectedTeammate && selectedTeammate.id === record.id,
                            }"
                            @click="
                                () =>
                                    selectedTeammate && selectedTeammate.id === record.id
                                        ? (selectedTeammate = null)
                                        : (selectedTeammate = record)
                            "
                        >
                            <div class="flex items-center w-9/12">
                                <avatar-component
                                    :labelShow="false"
                                    :label-avatar="record.full_name"
                                    :bgAvatar="record.avatar_bg"
                                    size="extra-small"
                                    :image="record.avatar_src ? `${envURL}${record.avatar_src}` : ''"
                                />
                                <div class="inline-block text-left flex flex-col ml-16p w-fill">
                                    <span
                                        class="truncate text-14 w-fill font-medium"
                                        :class="{
                                            'text-primary-500': selectedTeammate && selectedTeammate.id === record.id,
                                        }"
                                        >{{ record.full_name }}</span
                                    >
                                    <span
                                        class="font-normal truncate text-12 w-fill"
                                        :class="{
                                            'text-neutrals-300': !(
                                                selectedTeammate && selectedTeammate.id === record.id
                                            ),
                                            'text-primary-300': selectedTeammate && selectedTeammate.id === record.id,
                                        }"
                                        >{{ record.email }}</span
                                    >
                                </div>
                            </div>
                            <icon-comp
                                v-if="selectedTeammate && selectedTeammate.id === record.id"
                                color="primary-500"
                                name="check"
                            ></icon-comp>
                        </div>
                    </template>
                    <div
                        class="text-center text-16 text-neutrals-500 truncate"
                        v-else-if="teammatesDisplay && searchValue"
                    >
                        <span
                            class="block mt-96p truncate"
                            v-html="
                                $t('setting.teammate_modal_handover_empty', {
                                    value: searchValue,
                                })
                            "
                        >
                        </span>
                    </div>
                </div>
            </div>
            <div v-else class="px-24p mx-auto text-center">
                <div class="font-bold text-24">{{ $t('setting.teammate_modal_handover_process_title') }}</div>
                <div
                    class="text-14 my-16p"
                    v-html="
                        $t('setting.teammate_modal_handover_process_description', {
                            value: selectedTeammate ? selectedTeammate.full_name : '',
                        })
                    "
                ></div>
                <Button size="medium" @click="closeModal">
                    {{ $t('setting.teammate_modal_handover_process_button') }}
                </Button>
            </div>
        </template>
        <template v-if="!isDeleteSuccess" v-slot:footer>
            <div class="flex justify-end">
                <Button class="mr-8p" type="outline" size="medium" @click="closeModal">
                    {{ $t('setting.teammate_modal_handover_button_cancel') }}
                </Button>
                <Button size="medium" :disabled="!selectedTeammate" @click="onSubmit">
                    {{ $t('setting.teammate_modal_handover_button_confirm') }}
                </Button>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import { computed, defineComponent, ref, inject, watch, onMounted } from 'vue';
import Button from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { useI18n } from 'vue-i18n';
import IconComp from '@/components/ui/IconComponent.vue';
import { useUser } from '@/modules/auth/composables/useUser';
import InputComp from '@/components/ui/InputComponent.vue';

export default defineComponent({
    name: 'SettingTeammateModalHandover',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        value: {
            type: Object,
        },
        teammates: {
            type: Array,
        },
    },
    components: {
        InputComp,
        IconComp,
        Button,
        ModalComponent,
        AvatarComponent,
    },
    setup(props, { emit }) {
        const selectedTeammate = ref<Teammate | null>(null);
        // const invalidCustomerId = ref<boolean>(false);
        const { t } = useI18n();
        const emitter: any = inject('emitter');
        const envURL = `${process.env.VUE_APP_FILE_URL}/`;
        const { deleteUserByID } = useUser();
        const isDeleteSuccess = ref<boolean>(false);
        const hoverTeammateId = ref<string | null>(null);
        const searchValue = ref<string | null>('');

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
                isDeleteSuccess.value = false;
                selectedTeammate.value = null;
                searchValue.value = '';
            },
        });

        const closeModal = async () => {
            emit('close');

            searchValue.value = '';
            window.setTimeout(() => {
                selectedTeammate.value = null;
                isDeleteSuccess.value = false;
            }, 1500);
        };

        const teammatesDisplay = computed(() => {
            if (searchValue.value && searchValue.value.trim().length > 0) {
                return props?.teammates?.filter(
                    (item: any) =>
                        item._id !== props.value?.id &&
                        item.full_name !== null &&
                        (item.full_name.toLowerCase().includes(searchValue.value?.toLowerCase()) ||
                            item.email.toLowerCase().includes(searchValue.value?.toLowerCase())),
                );
            } else return props?.teammates?.filter((item: any) => item._id !== props.value?.id);
        });

        const onSubmit = async () => {
            try {
                if (selectedTeammate.value) {
                    await deleteUserByID(props.value?.id, { transfer_to: selectedTeammate.value.id });
                    isDeleteSuccess.value = true;
                    emit('delete-success');
                }
            } catch (e) {
                console.log(e);
                closeModal();
            }
        };

        return {
            showModalSync,
            closeModal,
            onSubmit,
            selectedTeammate,
            envURL,
            isDeleteSuccess,
            hoverTeammateId,
            searchValue,
            teammatesDisplay,
        };
    },
});
</script>

<style lang="scss" scoped>
.model-handover-teammate {
    &__list {
        > div {
        }
    }
}
</style>
