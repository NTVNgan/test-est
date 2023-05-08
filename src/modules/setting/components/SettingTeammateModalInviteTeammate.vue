<template>
    <modal-component v-model="showModalSync" :custom-class="'py-24p'" :width="'464px'" class="model-add-contact z-999">
        <template v-slot:header>
            <div class="flex">
                <span class="font-medium text-16">{{ $t('setting.teammate_modal_invite_title') }}</span>
            </div>
        </template>
        <template v-slot:body>
            <div
                ref="scrollWrapper"
                tabindex="1"
                class="max-h-236 overflow-y-auto scrollbar--transparent py-4p px-24p"
                :class="{ 'pr-8p': isShowScrollbar }"
            >
                <template v-for="(item, index) in formData" :key="`email-${index}`">
                    <div class="input__select flex" :class="{ 'mt-12p': index > 0 }">
                        <Input
                            :state="item.error && item.error !== 'email_required' ? 'error' : 'primary'"
                            class="flex-1"
                            v-model.trim="item.email"
                            placeholder="name@work-email.com"
                        >
                            <template v-slot:suffix>
                                <dropdown-role v-model:modelValue="item.roleId" :roleList="roles" />
                            </template>
                        </Input>
                        <Button
                            v-if="formData.length > 1"
                            class="input__select--remove ml-4p mt-3p"
                            icon="times"
                            type="subtle"
                            @click="removeEmailTeammate(index)"
                        ></Button>
                    </div>
                    <div
                        v-if="item.error && item.error !== 'email_required'"
                        class="break-words text-14 text-error-3 mt-4p"
                    >
                        {{ $t(`setting.invite_teammate_error_${item.error}`) }}
                    </div>
                </template>
            </div>
            <div class="px-24p">
                <template v-if="formData.length + totalTeammate < 200">
                    <Button
                        class="mt-12p"
                        type="subtle"
                        :disabled="formData.length === 20"
                        @click="addMoreEmailTeammate"
                    >
                        <icon-component name="plus" class="mr-4p" />
                        <span class="text-14">{{ $t('setting.teammate_modal_invite_button_add_more') }}</span>
                    </Button>
                </template>
                <template v-else>
                    <Alert :type="'warning'" class="mt-12p" :close="false" nameIcon="exclamation-circle">
                        <template v-slot:message>
                            <div class="text-14 my-2p">{{ $t('setting.teammate_modal_invite_alert_limit') }}</div>
                        </template>
                    </Alert>
                </template>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end">
                <Button class="mr-8p" type="outline" size="medium" @click="closeModal">
                    {{ $t('setting.teammate_modal_invite_button_cancel') }}
                </Button>
                <Button size="medium" :disabled="checkDisableButton || loading" @click="onSubmitEmail">
                    {{ $t('setting.teammate_modal_invite_button_invite') }}
                </Button>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { computed, defineComponent, ref, nextTick, watch } from 'vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Alert from '@/components/ui/AlertComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import DropdownRole from '../components/SettingTeammateDropdownRole.vue';
import { useTeammate } from '@/modules/setting/composables/useTeammate';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import { useRole } from '@/composables/useRole';
import { validateEmail } from '@/utils/validate';

export default defineComponent({
    name: 'SettingTeammateInviteTeammate',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        totalTeammate: {
            type: Number,
            default: 0,
        },
    },
    components: {
        Button,
        Input,
        Alert,
        ModalComponent,
        IconComponent,
        DropdownRole,
    },
    setup(props, { emit }) {
        const { error, errorMessage, loading, inviteTeammate } = useTeammate();
        const { addToast } = useToast();
        const { roles } = useRole();
        const { t } = useI18n();

        const scrollWrapper = ref<HTMLElement>();
        const isShowScrollbar = ref<boolean>(false);
        const teammateExistEmailList = ref<any>([]);
        const teammateExistOtherOrgEmailList = ref<any>([]);
        const formData = ref<InviteTeammateEmail[]>([
            {
                email: '',
                roleId: '',
                error: 'email_required',
            },
        ]);

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });
        const emailList = computed(() => {
            return formData.value.map((item: any) => item.email);
        });
        const checkDisableButton = computed(() => {
            return formData.value.some((item: any) => item.error !== '');
        });
        const invalidEmailList = computed(() => {
            const invalidList = [];
            for (let index = 0; index < formData.value.length; index++) {
                const item = formData.value[index];
                if (item.email !== '' && !validateEmail(item.email)) {
                    invalidList.push(item.email);
                }
            }
            return invalidList;
        });

        const checkShowScrollbar = async () => {
            await nextTick();
            if (scrollWrapper.value) {
                isShowScrollbar.value = scrollWrapper.value.scrollHeight > scrollWrapper.value.clientHeight;
            }
        };
        const setErrorEmail = (index: any, errorValue: string) => {
            formData.value[index].error = errorValue;
        };
        const formatDataToSendAPI = () => {
            const data: any = {};
            roles.value.forEach((role: any) => {
                const emailByRole = formData.value.filter((item: any) => item.roleId === role._id);
                if (emailByRole.length > 0) {
                    data[role._id] = emailByRole.map((item: any) => item.email);
                }
            });
            return data;
        };
        const addMoreEmailTeammate = async () => {
            formData.value.push({
                email: '',
                roleId: roles.value[1]._id,
                error: 'email_required',
            });
            await nextTick();
            if (scrollWrapper.value) {
                scrollWrapper.value.scrollTop = scrollWrapper.value.scrollHeight;
            }
        };
        const removeEmailTeammate = async (index: number) => {
            formData.value.splice(index, 1);
            await nextTick();
            if (scrollWrapper.value) {
                scrollWrapper.value.focus();
            }
        };
        const setTeammateExistsEmailError = () => {
            for (let index = 0; index < emailList.value.length; index++) {
                const item = emailList.value[index];
                if (teammateExistEmailList.value.includes(item)) {
                    setErrorEmail(index, 'teammate_exists');
                }
            }
        };
        const setTeammateExistsOtherOrgEmailError = () => {
            for (let index = 0; index < emailList.value.length; index++) {
                const item = emailList.value[index];
                if (teammateExistOtherOrgEmailList.value.includes(item)) {
                    setErrorEmail(index, 'teammate_exists_other_org');
                }
            }
        };
        const closeModal = async () => {
            emit('close');
        };
        const onSubmitEmail = async () => {
            if (checkDisableButton.value) return;
            const dataPayload = formatDataToSendAPI();
            await inviteTeammate(dataPayload);
            if (errorMessage.value !== null && Object.keys(errorMessage.value)) {
                for (let index = 0; index < Object.keys(errorMessage.value).length; index++) {
                    const errorKey = Object.keys(errorMessage.value)[index];
                    if (errorKey === 'teammate_exists') {
                        teammateExistEmailList.value = Object.values(errorMessage.value)[index];
                        setTeammateExistsEmailError();
                    }
                    if (errorKey === 'teammate_exists_other_org') {
                        teammateExistOtherOrgEmailList.value = Object.values(errorMessage.value)[index];
                        setTeammateExistsOtherOrgEmailError();
                    }
                }
                checkShowScrollbar();
                return;
            }
            if (!error.value) {
                addToast({
                    title: t('setting.teammate_modal_invite_toast_success'),
                    type: 'basic',
                    timeout: 3000,
                });
                closeModal();
            }
        };

        watch(
            () => props.showModal,
            (newVal: boolean) => {
                formData.value[0].roleId = roles.value[1]._id;
                if (!newVal) {
                    formData.value = [
                        {
                            email: '',
                            roleId: roles.value[1]._id,
                            error: 'email_required',
                        },
                    ];
                }
            },
            { deep: true },
        );
        watch(
            () => emailList.value,
            (newVal: any) => {
                for (let index = 0; index < newVal.length; index++) {
                    const item = newVal[index];
                    const beforeItems: any = emailList.value.slice(0, index);
                    if (item !== '' && beforeItems.includes(item) && !invalidEmailList.value.includes(item)) {
                        setErrorEmail(index, 'email_exists');
                    } else if (item === '') {
                        setErrorEmail(index, 'email_required');
                    } else if (invalidEmailList.value.includes(item)) {
                        setErrorEmail(index, 'email_format_invalid');
                    } else if (teammateExistEmailList.value.includes(item)) {
                        setErrorEmail(index, 'teammate_exists');
                    } else if (teammateExistOtherOrgEmailList.value.includes(item)) {
                        setErrorEmail(index, 'teammate_exists_other_org');
                    } else {
                        setErrorEmail(index, '');
                    }
                    checkShowScrollbar();
                }
            },
            { deep: true },
        );

        return {
            formData,
            showModalSync,
            roles,
            loading,
            isShowScrollbar,
            scrollWrapper,
            checkDisableButton,
            onSubmitEmail,
            teammateExistEmailList,
            teammateExistOtherOrgEmailList,
            closeModal,
            addMoreEmailTeammate,
            removeEmailTeammate,
        };
    },
});
</script>

<style lang="scss" scoped>
.input__select {
    &--remove {
        display: none;
    }
    &:hover,
    &:focus-within {
        .input__select--remove {
            display: flex;
        }
    }
}
</style>
