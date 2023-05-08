<template>
    <div class="relative w-full">
        <template v-if="!isShowResponse">
            <div
                @click="removeOrgName"
                class="absolute left-52p top-32p z-999 text-14 text-primary-500 cursor-pointer flex items-center"
            >
                <icon-component name="LongArrowLeft" color="primary-500" class="mr-2p" />
                {{ $t('slp.auth_navigate_company_name') }}
            </div>
            <div class="absolute right-52p top-32p z-999">
                <div class="cursor-pointer flex items-center" @click="skipInvitaion">
                    <span class="text-primary-500 text-16"> {{ $t('slp.auth_navigate_skip') }}</span>
                </div>
            </div>
        </template>
        <div v-if="!isShowResponse" class="pt-168p">
            <div class="w-416 mx-auto mb-36p">
                <h3 class="font-heading text-30 text-primary-500">{{ $t('slp.invite_teammate_text_now') }},</h3>
                <h4 class="font-heading text-36 font-semibold text-primary-500">
                    {{ $t('slp.invite_teammate_text_title') }}
                </h4>
            </div>
            <div
                ref="authWrapper"
                class="w-528 max-h-352 mx-auto overflow-y-auto scrollbar--transparent"
                :class="{ 'pl-16p': isShowScrollbar }"
            >
                <div class="w-416 py-12p mx-auto">
                    <div class="input__select relative" v-for="(item, index) in formData" :key="`email-${index}`">
                        <Input
                            :state="item.error && item.error !== 'email_required' ? 'error' : 'primary'"
                            class="input--auth"
                            :class="{ 'mt-12p': index > 0 }"
                            v-model.trim="item.email"
                            v-on:keydown.enter.prevent="onSubmitEmail"
                            placeholder="name@work-email.com"
                        >
                            <template v-slot:prefix>
                                <svg
                                    class="ml-4p"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M20.125 5H3.875C2.82031 5 2 5.85938 2 6.875V18.125C2 19.1797 2.82031 20 3.875 20H20.125C21.1406 20 22 19.1797 22 18.125V6.875C22 5.85938 21.1406 5 20.125 5ZM3.875 6.25H20.125C20.4375 6.25 20.75 6.5625 20.75 6.875V8.51562C19.8906 9.21875 18.6406 10.2344 14.8516 13.2422C14.1875 13.7891 12.8984 15.0391 12 15C11.0625 15.0391 9.77344 13.7891 9.10938 13.2422C5.32031 10.2344 4.07031 9.21875 3.25 8.51562V6.875C3.25 6.5625 3.52344 6.25 3.875 6.25ZM20.125 18.75H3.875C3.52344 18.75 3.25 18.4766 3.25 18.125V10.1172C4.10938 10.8594 5.51562 11.9922 8.32812 14.2188C9.14844 14.8828 10.5547 16.2891 12 16.25C13.4062 16.2891 14.8125 14.8828 15.6328 14.2188C18.4453 11.9922 19.8516 10.8594 20.75 10.1172V18.125C20.75 18.4766 20.4375 18.75 20.125 18.75Z"
                                        fill="#B4B4BE"
                                    />
                                </svg>
                            </template>
                            <template v-slot:suffix>
                                <auth-dropdown-role v-model:modelValue="item.roleId" :roleList="roles" />
                            </template>
                        </Input>
                        <div
                            class="input__select--remove"
                            v-if="formData.length > 1"
                            @click="removeEmailTeammate(index)"
                        >
                            <icon-component name="TimesCircle" color="error-3" />
                        </div>
                        <div
                            v-if="item.error && item.error !== 'email_required'"
                            class="break-words text-16 text-error-3 mt-8p"
                        >
                            {{ $t(`slp.invite_teammate_error_${item.error}`) }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-416 mx-auto mt-10p">
                <Button type="link" :disabled="formData.length === 20" @click="addMoreEmailTeammate">
                    <icon-component name="plus" color="primary-500" class="mr-2p" />
                    <span class="text-14">{{ $t('slp.invite_teammate_button_add_more') }}</span>
                </Button>
                <Button
                    :disabled="checkDisableButton || loading"
                    class="button--auth w-fill mt-48p mb-24p"
                    @click="onSubmitEmail"
                >
                    <template v-if="!loading">{{ $t('slp.invite_teammate_button_invite') }}</template>
                    <template v-else>
                        <Spinner size="small" color="#fff" />
                    </template>
                </Button>
            </div>
        </div>
        <template v-else>
            <Response v-if="response !== ''" :srcImg="'images/img-speaker.png'" :widthImg="'w-428'">
                <template v-slot:title>
                    <h2>{{ $t('slp.invite_teammate_response_title') }}</h2>
                </template>
                <template v-slot:body>
                    <p class="text-14 text-neutrals-400 mt-16p mb-32p">
                        {{ $t(`slp.invite_teammate_response_subtitle_${response}`) }}
                    </p>
                    <router-link :to="{ name: 'SettingInstallation' }">
                        <Button type="primary">
                            {{ $t('slp.invite_teammate_response_button_explore') }}
                        </Button>
                    </router-link>
                </template>
            </Response>
            <LoadingScreen v-if="response === 'network_error'" />
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, inject, nextTick, onMounted } from 'vue';
import LoadingScreen from '../components/AuthLoadingScreen.vue';
import Response from '../components/AuthResponse.vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Spinner from '@/components/ui/Spinner.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import AuthDropdownRole from '../components/AuthDropdownRole.vue';
import { useTeammate } from '@/modules/setting/composables/useTeammate';
import { useRole } from '@/composables/useRole';
import { useOrg } from '@/modules/org/composable/useOrg';
import { useUser } from '../composables/useUser';
import { useRouter } from 'vue-router';
import { store } from '@/store';
import { validateEmail } from '@/utils/validate';

export default defineComponent({
    name: 'AuthInviteTeammate',
    components: {
        LoadingScreen,
        Response,
        Button,
        Input,
        Spinner,
        IconComponent,
        AuthDropdownRole,
    },
    setup() {
        const authWrapper = ref<HTMLElement>();

        const emitter: any = inject('emitter');
        const response = ref<string>('');
        const teammateExistEmailList = ref<any>([]);
        const teammateExistOtherOrgEmailList = ref<any>([]);
        const formData = ref<InviteTeammateEmail[]>([
            {
                email: '',
                roleId: '',
                error: 'email_required',
            },
        ]);
        const isShowResponse = ref<boolean>(false);
        const isShowScrollbar = ref<boolean>(false);
        const { error, errorMessage, loading, inviteTeammate } = useTeammate();
        const { roles, getRole } = useRole();
        const { updateOrg, loadingUpdateOrg } = useOrg();
        const { getUserById } = useUser();
        const router = useRouter();
        const { org_id: orgId, _id: userId } = store.state.auth.user;

        const isSettingOrg = computed(() => store.state.auth.user.is_setting_org);
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
            if (authWrapper.value) {
                isShowScrollbar.value = authWrapper.value.scrollHeight > authWrapper.value.clientHeight;
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
        const addMoreEmailTeammate = () => {
            formData.value.push({
                email: '',
                roleId: roles.value[1]._id,
                error: 'email_required',
            });
        };
        const removeEmailTeammate = (index: number) => {
            formData.value.splice(index, 1);
        };
        const skipInvitaion = () => {
            isShowResponse.value = true;
            response.value = 'skip';
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
        const removeOrgName = async () => {
            try {
                const orgData = await updateOrg({ id: orgId, name: null });
                if (orgData) {
                    const userData = await getUserById(userId);
                    userData && store.commit('auth/UPDATE_USER_AUTH', userData);
                    !isSettingOrg.value && router.push({ name: 'InputCompanyName' });
                }
            } catch (e) {
                console.log({ e });
            }
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
            if (errorMessage.value === 'Network Error') {
                isShowResponse.value = true;
                response.value = 'network_error';
                return;
            }
            if (!error.value) {
                isShowResponse.value = true;
                response.value = 'success';
            }
        };
        emitter.on('isOnline', (value: boolean) => {
            if (value) {
                isShowResponse.value = false;
                formData.value = [
                    {
                        email: '',
                        roleId: roles.value[1]._id,
                        error: 'email_required',
                    },
                ];
            }
        });
        onMounted(async () => {
            await getRole();
            formData.value[0].roleId = roles.value[1]._id;
        });
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
            authWrapper,
            addMoreEmailTeammate,
            removeEmailTeammate,
            emailList,
            formData,
            roles,
            isShowResponse,
            error,
            errorMessage,
            loading,
            response,
            onSubmitEmail,
            skipInvitaion,
            invalidEmailList,
            teammateExistEmailList,
            checkDisableButton,
            removeOrgName,
            isShowScrollbar,
        };
    },
});
</script>

<style lang="scss" scoped>
.text-36 {
    line-height: 40px;
}
.btn__contact {
    padding: 0;
}
.input--auth {
    &:focus-within {
        box-shadow: 0 0 0 3px #bfcef3;
    }
    &.ring-error {
        box-shadow: 0 0 0 3px #f29f8f;
    }
}
.input__select {
    // padding: 0 30px;
    &--remove {
        display: none;
        position: absolute;
        top: calc(56px / 2);
        left: 100%;
        padding-left: 4px;
        transform: translateY(-50%);
        cursor: pointer;
    }
    &:hover {
        .input__select--remove {
            display: block;
        }
        .input--auth {
            box-shadow: 0 0 0 3px #bfcef3;
            border-color: #3e6dda;
        }
        .input--auth.ring-error {
            box-shadow: 0 0 0 3px #f29f8f;
            border-color: #ec2b08;
        }
    }
}
</style>
