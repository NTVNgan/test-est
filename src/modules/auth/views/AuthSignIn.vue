<template>
    <div class="auth-signin relative w-full">
        <div class="absolute right-52p top-32p">
            <template v-if="!isOnActiveMailFlow">
                {{ $t('slp.auth_navigate_new') }}
                <router-link :to="{ name: 'SignUp' }" class="text-primary-500 cursor-pointer">Sign up</router-link>
            </template>
        </div>
        <template v-if="!isShowNetworkError">
            <template v-if="loginStep === 'login-form'">
                <div v-if="!isOnActiveMailFlow" class="auth-signin py-168p w-416 mx-auto">
                    <h3 class="font-heading text-30 text-primary-500">{{ $t('slp.signin_text_hello') }},</h3>
                    <h4 class="font-heading text-36 font-semibold text-primary-500">
                        {{ $t('slp.signin_text_login') }}
                    </h4>
                    <Alert v-if="activeMailStatus === 'done'" class="mt-24p" :close="false" type="success">
                        <template v-slot:title>
                            <span class="text-16 font-medium">{{ $t(`slp.signin_text_active_sucess_title`) }}</span>
                        </template>
                        <template v-slot:message>
                            <span class="text-14" v-html="$t('slp.signin_text_active_sucess_subtle')" />
                        </template>
                    </Alert>
                    <Alert
                        v-if="
                            isError && !['wrong_password', 'please_enter_a_valid_email'].includes(Object.keys(error)[0])
                        "
                        class="mt-24p"
                        type="error"
                        :close="false"
                        nameIcon="exclamation-circle"
                    >
                        <template v-slot:message>
                            <span
                                class="text-14"
                                v-html="
                                    $t(`slp.signin_error_${Object.keys(error)[0]}`, {
                                        number: `<b style='color:red'>${Object.values(error)[0]}</b>`,
                                    })
                                "
                            />
                        </template>
                    </Alert>
                    <form>
                        <Input
                            :state="isErrorEmailValid ? 'error' : 'primary'"
                            class="input--auth mt-24p"
                            v-model="usernameValue"
                            placeholder="name@work-email.com"
                            v-on:keydown.enter="onLogin"
                        >
                            <template v-slot:prefix>
                                <svg
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
                        </Input>
                        <span v-if="isErrorEmailValid" class="inline-block text-error-3 mt-8p">
                            {{ $t('common.error_invalid_email_format') }}
                        </span>
                        <Input
                            :state="errorKey == 'wrong_password' && isError ? 'error' : 'primary'"
                            class="input--auth mt-24p"
                            type="password"
                            v-model="passwordValue"
                            :placeholder="$t('slp.signin_placeholder_password')"
                            v-on:keydown.enter="onLogin"
                        >
                            <template v-slot:prefix>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M15.125 3.75C18.2109 3.75 20.75 6.28906 20.75 9.375C20.75 12.5 18.2109 15 15.125 15C14.3828 15 13.6406 14.8828 13.0156 14.6094L11.375 16.25H9.5V18.75H7V21.25H3.25V18.125L9.89062 11.4844C9.61719 10.8594 9.5 10.1172 9.5 9.375C9.5 6.28906 12 3.75 15.125 3.75ZM15.125 2.5C11.2969 2.5 8.25 5.58594 8.25 9.375C8.25 10 8.28906 10.5859 8.44531 11.1328L2.27344 17.3438C2.11719 17.5 2 17.8125 2 18.0078V21.5625C2 22.1094 2.39062 22.5 2.9375 22.5H7.3125C7.82031 22.5 8.25 22.1094 8.25 21.5625V20H9.8125C10.3203 20 10.75 19.6094 10.75 19.0625V17.5H11.4922C11.7266 17.5 11.9609 17.4219 12.1562 17.2266L13.3672 16.0547C13.9141 16.2109 14.5 16.25 15.125 16.25C18.9141 16.25 22 13.2031 22 9.375C22 5.58594 18.9141 2.5 15.125 2.5ZM17 6.71875C17.4297 6.71875 17.7812 7.07031 17.7812 7.5C17.7812 7.96875 17.4297 8.28125 17 8.28125C16.5312 8.28125 16.2188 7.96875 16.2188 7.5C16.2188 7.07031 16.5312 6.71875 17 6.71875ZM17 5.625C15.9453 5.625 15.125 6.48438 15.125 7.5C15.125 8.55469 15.9453 9.375 17 9.375C18.0156 9.375 18.875 8.55469 18.875 7.5C18.875 6.48438 18.0156 5.625 17 5.625Z"
                                        fill="#A4A4AE"
                                    />
                                </svg>
                            </template>
                        </Input>
                        <span v-if="isError && errorKey == 'wrong_password'" class="inline-block text-error-3 mt-8p">
                            {{ $t('slp.signin_error_wrongpwd') }}
                        </span>
                        <div class="mt-18p flex justify-between items-center">
                            <CheckBox v-model="isRemember" :nameSingleCheckbox="'singlecheck'">
                                <template v-slot:label>Remember me</template>
                            </CheckBox>
                            <router-link
                                :to="{ name: 'ForgotPassword' }"
                                class="text-primary-500 cursor-pointer text-14"
                            >
                                {{ $t('slp.signin_text_forgotpwd') }}
                            </router-link>
                        </div>
                        <Button
                            :disabled="!usernameValue || !passwordValue"
                            class="button--auth w-fill mt-48p"
                            @click="onLogin"
                        >
                            <template v-if="!loading">{{ $t('slp.signin_btn_login') }}</template>
                            <template v-else>
                                <Spinner size="small" color="#fff" />
                            </template>
                        </Button>
                    </form>
                </div>
                <template v-else>
                    <Response v-if="activeMailStatus === 'used_url'" :srcImg="'images/link-used.png'">
                        <template v-slot:title>
                            <h2>{{ $t('slp.set_new_pass_res_linked_used_title') }}</h2>
                        </template>
                        <template v-slot:body>
                            <p class="text-14 text-neutrals-400 mt-16p mb-40p">
                                {{ $t('slp.signin_text_active_used_title') }}
                                <a @click="onResetLogin" class="text-primary-500 focus:outline-none cursor-pointer">{{
                                    $t('slp.signin_text_active_used_link')
                                }}</a>
                                <br />
                                {{ $t('slp.signin_text_active_used_subtle') }}
                            </p>
                        </template>
                    </Response>
                    <Response
                        v-else-if="['invalid_url', 'expired_url'].includes(activeMailStatus)"
                        :srcImg="'images/error-expired.png'"
                    >
                        <template v-slot:title>
                            <h2 v-if="activeMailStatus === 'expired_url'">
                                {{ $t('slp.signin_text_active_expried_title') }}
                            </h2>
                            <h2 v-else>{{ $t('slp.signin_text_active_invalid_title') }}</h2>
                        </template>
                        <template v-slot:body>
                            <p class="text-14 text-neutrals-400 mt-16p mb-40p">
                                <template v-if="activeMailStatus === 'expired_url'">
                                    <span v-html="$t('slp.signin_text_active_expried_subtle')" />
                                    {{ ' ' }}
                                    <router-link :to="{ name: 'SignUp' }" class="text-primary-500 focus:outline-none">{{
                                        $t('slp.signin_text_active_expired_link')
                                    }}</router-link>
                                    {{ $t('slp.signin_text_active_subtle') }}
                                </template>
                                <template v-if="activeMailStatus === 'invalid_url'">
                                    <span v-html="$t('slp.signin_text_active_invalid_subtle2')" />
                                    {{ ' ' }}
                                    <router-link :to="{ name: 'SignUp' }" class="text-primary-500 focus:outline-none">{{
                                        $t('slp.signin_text_active_expired_link')
                                    }}</router-link>
                                    {{ $t('slp.signin_text_active_subtle') }}
                                </template>
                            </p>
                        </template>
                    </Response>
                </template>
            </template>
            <template v-if="loginStep === 'choose-workspace'">
                <div class="pt-168p">
                    <div class="w-416 mx-auto mb-48p">
                        <h3 class="font-heading text-30 text-primary-500">
                            {{ $t('slp.signin_choose_workspace_title') }},
                        </h3>
                        <h4 class="font-heading text-36 font-semibold text-primary-500">
                            {{ $t('slp.signin_choose_workspace_subtitle') }}
                        </h4>
                    </div>
                    <div
                        ref="authWrapper"
                        class="w-480 max-h-302 py-16p mx-auto overflow-y-auto scrollbar--transparent"
                        :class="{ 'pl-16p': isShowScrollbar }"
                    >
                        <div class="w-416 mx-auto">
                            <div
                                v-for="(item, index) in userWorkspaces"
                                :key="item"
                                class="select--auth cursor-pointer flex"
                                :class="[{ 'mt-16p': index > 0 }, { selected: item.workspace_id === workspaceIdValue }]"
                                @click="selectWorkspace(item.workspace_id)"
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10.5 6.67969C10.5 6.44531 10.2656 6.21094 10.0312 6.21094H8.46875C8.19531 6.21094 8 6.44531 8 6.67969V8.24219C8 8.51562 8.19531 8.71094 8.46875 8.71094H10.0312C10.2656 8.71094 10.5 8.51562 10.5 8.24219V6.67969ZM15.0312 6.21094H13.4688C13.1953 6.21094 13 6.44531 13 6.67969V8.24219C13 8.51562 13.1953 8.71094 13.4688 8.71094H15.0312C15.2656 8.71094 15.5 8.51562 15.5 8.24219V6.67969C15.5 6.44531 15.2656 6.21094 15.0312 6.21094ZM10.0312 9.96094H8.46875C8.19531 9.96094 8 10.1953 8 10.4297V11.9922C8 12.2656 8.19531 12.4609 8.46875 12.4609H10.0312C10.2656 12.4609 10.5 12.2656 10.5 11.9922V10.4297C10.5 10.1953 10.2656 9.96094 10.0312 9.96094ZM15.0312 9.96094H13.4688C13.1953 9.96094 13 10.1953 13 10.4297V11.9922C13 12.2656 13.1953 12.4609 13.4688 12.4609H15.0312C15.2656 12.4609 15.5 12.2656 15.5 11.9922V10.4297C15.5 10.1953 15.2656 9.96094 15.0312 9.96094ZM10.0312 13.7109H8.46875C8.19531 13.7109 8 13.9453 8 14.1797V15.7422C8 16.0156 8.19531 16.2109 8.46875 16.2109H10.0312C10.2656 16.2109 10.5 16.0156 10.5 15.7422V14.1797C10.5 13.9453 10.2656 13.7109 10.0312 13.7109ZM15.0312 13.7109H13.4688C13.1953 13.7109 13 13.9453 13 14.1797V15.7422C13 16.0156 13.1953 16.2109 13.4688 16.2109H15.0312C15.2656 16.2109 15.5 16.0156 15.5 15.7422V14.1797C15.5 13.9453 15.2656 13.7109 15.0312 13.7109ZM20.5 21.7188C20.5 21.4844 20.2656 21.25 20.0312 21.25H19.25V3.4375C19.25 2.92969 18.8203 2.5 18.3125 2.5H5.1875C4.64062 2.5 4.25 2.92969 4.25 3.4375V21.25H3.46875C3.19531 21.25 3 21.4844 3 21.7188V22.5H20.5V21.7188ZM18 21.25H13V17.9297C13 17.6953 12.7656 17.4609 12.5312 17.4609H10.9688C10.6953 17.4609 10.5 17.6953 10.5 17.9297V21.25H5.5V3.75H18V21.25Z"
                                        fill="#B4B4BE"
                                    />
                                </svg>
                                <span class="ml-12p text-16 flex-1">
                                    {{
                                        item.workspace_name
                                            ? item.workspace_name
                                            : `${$t('slp.signin_choose_workspace_untitled_name')} ${setUntitledCompanyName(item.workspace_id)}`
                                    }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="w-416 mx-auto">
                        <Button
                            :disabled="!workspaceIdValue || loading"
                            class="button--auth w-fill mt-48p"
                            @click="onLogin"
                        >
                            <template v-if="!loading">{{
                                $t('slp.signin_choose_workspace_button_start_working')
                            }}</template>
                            <template v-else>
                                <Spinner size="small" color="#fff" />
                            </template>
                        </Button>
                    </div>
                </div>
            </template>
        </template>
        <LoadingScreen v-else />
    </div>
</template>

<script lang="ts">
import { ref, inject, watch, nextTick, computed } from 'vue';
import Response from '../components/AuthResponse.vue';
import Input from '@/components/ui/InputComponent.vue';
import Alert from '@/components/ui/AlertComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import CheckBox from '@/components/ui/CheckboxComponent.vue';
import Spinner from '@/components/ui/Spinner.vue';
import useVuelidate from '@vuelidate/core';
import LoadingScreen from '../components/AuthLoadingScreen.vue';
import { email } from '@vuelidate/validators';
import { useAuth } from '../composables/useAuth';
import { useRoute } from 'vue-router';
import { services } from '../services';
import { validateEmail } from '@/utils/validate';
import { store } from '@/store';
export default {
    name: 'SignIn',
    validations() {
        return {
            usernameValue: { email, validateEmail },
        };
    },
    components: {
        Spinner,
        Response,
        Alert,
        Button,
        Input,
        CheckBox,
        LoadingScreen,
    },
    setup() {
        const emitter: any = inject('emitter');
        const usernameValue = ref<string>('');
        const passwordValue = ref<string>('');
        const workspaceIdValue = ref<string>('');
        const isRemember = ref<boolean>(false);
        const isShowScrollbar = ref<boolean>(false);
        const isError = ref<boolean>(false);
        const isErrorEmailValid = ref<boolean>(false);
        const { login, error, loading } = useAuth();
        const errorKey = ref<string | null>('');
        const { query } = useRoute();
        const { hash, user_id: userId }: any = query;
        const isOnActiveMailFlow = ref<boolean>(false);
        const activeMailStatus = ref<string>('');
        const isLoadingActivate = ref<boolean>(false);
        const isShowNetworkError = ref<boolean>(false);
        const loginStep = ref<string>('login-form'); // choose-workspace | login-form
        const userWorkspaces = ref<any>([]);
        const authWrapper = ref<HTMLElement>();
        const v$ = useVuelidate();

        const setUntitledCompanyName = computed(() => {
            return (id: any) => {
                return id.slice(id.length - 5);
            };
        });

        const onResetLogin = () => {
            activeMailStatus.value = '';
            isOnActiveMailFlow.value = false;
        };
        const checkShowScrollbar = async () => {
            await nextTick();
            if (authWrapper.value) {
                isShowScrollbar.value = authWrapper.value.scrollHeight > authWrapper.value.clientHeight;
            }
        };
        const onActiveMail = async (userID: string, hash: string) => {
            isLoadingActivate.value = true;
            const res = await services.activeAccount({ user_id: userID, hash });
            if (res) {
                const { data: resData } = res;
                const { error, data, message } = resData;
                if (!error && data) {
                    activeMailStatus.value = 'done';
                    isOnActiveMailFlow.value = false;
                    usernameValue.value = data.email;
                } else if (error) {
                    activeMailStatus.value = Object.keys(message)[0];
                }
            }
            isLoadingActivate.value = false;
        };
        if (hash && userId) {
            isOnActiveMailFlow.value = true;
            onActiveMail(userId, hash);
        }
        const selectWorkspace = (workspaceId: string) => {
            workspaceIdValue.value = workspaceId;
        };
        const onLogin = async () => {
            if (v$.value.$invalid) {
                isErrorEmailValid.value = true;
                isError.value = false;
                return;
            }
            isErrorEmailValid.value = false;
            isError.value = false;
            const valUser = JSON.parse(JSON.stringify(v$.value.usernameValue)).validateEmail.$invalid;
            if (usernameValue.value && !valUser && passwordValue.value) {
                if (loginStep.value === 'choose-workspace') {
                    await login({
                        email: usernameValue.value,
                        password: passwordValue.value,
                        remember_me: isRemember.value,
                        workspace_id: workspaceIdValue.value,
                    });
                } else {
                    await login({
                        email: usernameValue.value,
                        password: passwordValue.value,
                        remember_me: isRemember.value,
                    });
                }
                if (error.value) {
                    if (error.value.message === 'Network Error') {
                        isShowNetworkError.value = true;
                        return;
                    }
                    const errorValue = Object.keys(error.value)[0];
                    if (errorValue === 'please_choose_workspaces') {
                        loginStep.value = 'choose-workspace';
                        userWorkspaces.value = store.state.auth.userWorkspaces;
                        return;
                    }
                    if (errorValue) {
                        isError.value = true;
                        errorKey.value = Object.keys(error.value)[0];
                        if (errorKey.value === 'please_enter_a_valid_email') {
                            isErrorEmailValid.value = true;
                        }
                    }
                } else {
                    isError.value = false;
                }
            }
        };
        emitter.on('isOnline', (value: boolean) => {
            if (value) {
                isShowNetworkError.value = false;
                usernameValue.value = '';
                passwordValue.value = '';
                isRemember.value = false;
            }
        });

        watch(
            () => usernameValue.value,
            () => {
                isErrorEmailValid.value = false;
            },
        );
        watch(
            () => userWorkspaces.value,
            () => {
                checkShowScrollbar();
            },
            { deep: true },
        );

        return {
            v$,
            error,
            loading,
            isError,
            isErrorEmailValid,
            errorKey,
            isRemember,
            usernameValue,
            passwordValue,
            onLogin,
            isOnActiveMailFlow,
            activeMailStatus,
            isLoadingActivate,
            isShowNetworkError,
            onResetLogin,
            loginStep,
            selectWorkspace,
            workspaceIdValue,
            authWrapper,
            isShowScrollbar,
            userWorkspaces,
            setUntitledCompanyName,
        };
    },
};
</script>

<style lang="scss" scoped>
.auth-signin {
    .text-36 {
        line-height: 40px;
    }
    h4 {
        font-weight: 600;
    }
    &__loader {
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
    }
}
@-webkit-keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
    }
}
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
