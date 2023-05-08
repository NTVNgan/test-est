<template>
    <div class="auth-signup relative w-full">
        <template v-if="isShowSignup">
            <div class="absolute right-52p top-32p">
                {{ $t('slp.auth_navigate_already_account') }}
                <router-link :to="{ name: 'SignIn' }" class="text-primary-500 cursor-pointer">Log in</router-link>
            </div>
        </template>
        <template v-else>
            <div class="absolute left-52p top-32p z-999">
                <div @click="reloadSignUp" class="cursor-pointer flex items-center">
                    <icon-component name="LongArrowLeft" color="primary-500" class="mr-2p" />
                    <span class="text-primary-500 text-14"> {{ $t('slp.auth_navigate_signup') }}</span>
                </div>
            </div>
        </template>
        <transition-group :name="'fade'" mode="out-in">
            <template v-if="!isShowNetworkError">
                <div v-if="isShowSignup" class="py-168p w-416 mx-auto">
                    <h3 class="font-heading text-30 text-primary-500">{{ $t('slp.signup_text_welcome') }}</h3>
                    <h4 class="font-heading text-36 font-semibold text-primary-500">
                        {{ $t('slp.signup_text_heading') }}
                    </h4>
                    <Alert v-if="isError" :type="'error'" class="mt-24p" :close="false" nameIcon="exclamation-circle">
                        <template v-slot:message>
                            <div class="text-14" v-html="$t(`slp.signup_error_${errorMessage}`)"></div>
                        </template>
                    </Alert>
                    <form>
                        <Input
                            :state="emailValue && !v$.emailValue.validateEmail.$response ? 'error' : 'primary'"
                            class="input--auth mt-24p"
                            v-model="emailValue"
                            placeholder="name@work-email.com"
                            v-on:keydown.enter="onSignup"
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
                        <span
                            v-if="emailValue && !v$.emailValue.validateEmail.$response"
                            class="inline-block text-error-3 mt-8p"
                            >{{ $t('common.error_invalid_email_format') }}</span
                        >
                        <Input
                            class="input--auth mt-24p"
                            type="password"
                            v-model="passwordValue"
                            :placeholder="$t('slp.signup_placeholder_passoword')"
                            v-on:keydown.enter="onSignup"
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
                        <template v-if="showValidatePass && !isError">
                            <template v-if="showSuccessPass">
                                <span class="flex items-center text-success-3 text-16 mt-8p">
                                    <icon-component name="check-circle-white" color="success-3" />
                                    {{ $t('slp.signup_success_password') }}
                                </span>
                            </template>
                            <template v-else>
                                <div class="mt-16p text-14 text-neutrals-300">
                                    <div class="grid grid-cols-2">
                                        <p
                                            class="flex items-center"
                                            :class="{ 'text-neutrals-900': checkFormatPassword.upper }"
                                        >
                                            <icon-component
                                                name="check"
                                                :color="checkFormatPassword.upper ? 'success-3' : 'neutrals-300'"
                                            />
                                            {{ $t('common.requied_uppercase_password') }}
                                        </p>
                                        <p
                                            class="flex items-center"
                                            :class="{ 'text-neutrals-900': checkFormatPassword.lower }"
                                        >
                                            <icon-component
                                                name="check"
                                                :color="checkFormatPassword.lower ? 'success-3' : 'neutrals-300'"
                                            />
                                            {{ $t('common.requied_lowercase_password') }}
                                        </p>
                                        <p
                                            class="flex items-center mt-8p"
                                            :class="{ 'text-neutrals-900': checkFormatPassword.number }"
                                        >
                                            <icon-component
                                                name="check"
                                                :color="checkFormatPassword.number ? 'success-3' : 'neutrals-300'"
                                            />
                                            {{ $t('common.requied_number_password') }}
                                        </p>
                                        <p
                                            class="flex items-center mt-8p"
                                            :class="{ 'text-neutrals-900': checkFormatPassword.special }"
                                        >
                                            <icon-component
                                                name="check"
                                                :color="checkFormatPassword.special ? 'success-3' : 'neutrals-300'"
                                            />
                                            {{ $t('common.requied_special_password') }}
                                        </p>
                                        <p
                                            class="flex items-center mt-8p"
                                            :class="{ 'text-neutrals-900': checkFormatPassword.min }"
                                        >
                                            <icon-component
                                                name="check"
                                                :color="checkFormatPassword.min ? 'success-3' : 'neutrals-300'"
                                            />
                                            {{ $t('common.requied_minimum_password') }}
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </template>
                        <Button
                            :disabled="!v$.emailValue.validateEmail.$response || !showSuccessPass"
                            class="button--auth w-fill mt-48p"
                            @click="onSignup"
                        >
                            <template v-if="!loading">{{ $t('slp.signup_btn') }}</template>
                            <template v-else>
                                <svg
                                    class="auth-signup__loader"
                                    width="21"
                                    height="20"
                                    viewBox="0 0 21 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12.375 1.875C12.375 0.859375 11.5156 0 10.5 0C9.44531 0 8.625 0.859375 8.625 1.875C8.625 2.92969 9.44531 3.75 10.5 3.75C11.5156 3.75 12.375 2.92969 12.375 1.875ZM10.5 16.25C9.44531 16.25 8.625 17.1094 8.625 18.125C8.625 19.1797 9.44531 20 10.5 20C11.5156 20 12.375 19.1797 12.375 18.125C12.375 17.1094 11.5156 16.25 10.5 16.25ZM18.625 8.125C17.5703 8.125 16.75 8.98438 16.75 10C16.75 11.0547 17.5703 11.875 18.625 11.875C19.6406 11.875 20.5 11.0547 20.5 10C20.5 8.98438 19.6406 8.125 18.625 8.125ZM4.25 10C4.25 8.98438 3.39062 8.125 2.375 8.125C1.32031 8.125 0.5 8.98438 0.5 10C0.5 11.0547 1.32031 11.875 2.375 11.875C3.39062 11.875 4.25 11.0547 4.25 10ZM4.71875 13.9062C3.70312 13.9062 2.84375 14.7266 2.84375 15.7812C2.84375 16.7969 3.70312 17.6562 4.71875 17.6562C5.77344 17.6562 6.59375 16.7969 6.59375 15.7812C6.59375 14.7266 5.77344 13.9062 4.71875 13.9062ZM16.2422 13.9062C15.1875 13.9062 14.3672 14.7266 14.3672 15.7812C14.3672 16.7969 15.1875 17.6562 16.2422 17.6562C17.2578 17.6562 18.1172 16.7969 18.1172 15.7812C18.1172 14.7266 17.2578 13.9062 16.2422 13.9062ZM4.71875 2.38281C3.70312 2.38281 2.84375 3.24219 2.84375 4.25781C2.84375 5.3125 3.70312 6.13281 4.71875 6.13281C5.77344 6.13281 6.59375 5.3125 6.59375 4.25781C6.59375 3.24219 5.77344 2.38281 4.71875 2.38281Z"
                                        fill="white"
                                    />
                                </svg>
                            </template>
                        </Button>
                    </form>
                </div>
                <template v-else>
                    <Response :srcImg="'images/verify-account.png'">
                        <template v-slot:title>
                            <h2>{{ $t('slp.signup_res_title') }}</h2>
                        </template>
                        <template v-slot:body>
                            <p
                                class="text-14 text-neutrals-400 mt-16p mb-40p"
                                v-html="$t('slp.signup_res_subtitle', { emailValue })"
                            ></p>
                            <div class="flex items-center justify-center">
                                <span class="text-14 text-neutrals-400">{{ $t('slp.signup_res_didnt_receive') }}</span>
                                <Button type="link" :disabled="resendDisabled" @click="resendInstructions">{{
                                    resendDisabled
                                        ? $t('slp.signup_res_resend_in_time', { resendTime })
                                        : $t('slp.signup_res_resend_email')
                                }}</Button>
                            </div>
                        </template>
                    </Response>
                </template>
            </template>
            <LoadingScreen v-else />
        </transition-group>
    </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, inject } from 'vue';
import Response from '../components/AuthResponse.vue';
import Input from '@/components/ui/InputComponent.vue';
import Alert from '@/components/ui/AlertComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import LoadingScreen from '../components/AuthLoadingScreen.vue';
import useVuelidate from '@vuelidate/core';
// import { useAuth } from '../composables/useAuth';
import { useValidatePassword } from '@/composables/useValidatePassword';
import { validateEmail } from '@/utils/validate';
import { store } from '@/store';
import { useUser } from '../composables/useUser';

export default defineComponent({
    name: 'SignUp',
    validations() {
        return {
            emailValue: { validateEmail },
        };
    },
    components: {
        Response,
        Alert,
        Button,
        Input,
        IconComponent,
        LoadingScreen,
    },
    setup() {
        const emitter: any = inject('emitter');
        const response = ref<number>(1),
            isShowSignup = ref<boolean>(true),
            showValidatePass = ref<boolean>(true),
            user_signup_id = ref<string>(''),
            loading = ref<boolean>(false),
            v$ = useVuelidate();

        const emailValue = ref<string>('');
        const errorMessage = ref<string>('');
        const isError = ref<boolean>(false);
        const isShowNetworkError = ref<boolean>(false);
        // const { signup, error, data, loading, sendEmailActive } = useAuth();
        const { sendEmailActive, signup } = useUser();
        const { passwordValue, checkFormatPassword, showSuccessPass } = useValidatePassword();
        const resendDisabled = ref<boolean>(false);
        const resendTime = ref<number>(0);

        const onSignup = async () => {
            const valEmail = JSON.parse(JSON.stringify(v$.value.emailValue)).validateEmail.$response;
            if (emailValue.value && valEmail === true && passwordValue.value && showSuccessPass.value === true) {
                loading.value = true;
                try {
                    const res = await signup({ email: emailValue.value, password: passwordValue.value });
                    if (res) {
                        isError.value = false;
                        isShowSignup.value = false;
                        user_signup_id.value = res._id;
                        loading.value = false;
                    }
                } catch (e) {
                    if (e.message === 'Network Error') {
                        isShowNetworkError.value = true;
                        return;
                    }
                    errorMessage.value = Object.keys(e)[0];
                    console.log(errorMessage.value);
                    loading.value = false;
                    isError.value = true;
                }
            }
        };

        const resendInstructions = async () => {
            resendDisabled.value = true;
            resendTime.value = 30;
            await sendEmailActive({ email: emailValue.value, user_id: user_signup_id.value });
        };

        const reloadSignUp = () => {
            isShowSignup.value = true;
            passwordValue.value = '';
            emailValue.value = '';
        };

        watch(resendTime, (newVal: number) => {
            if (newVal > 0) {
                setTimeout(() => {
                    resendTime.value--;
                }, 1000);
            } else {
                clearTimeout();
                resendDisabled.value = false;
            }
        });

        emitter.on('isOnline', (value: boolean) => {
            if (value) {
                isShowNetworkError.value = false;
                isShowSignup.value = true;
                passwordValue.value = '';
                emailValue.value = '';
                loading.value = false;
            }
        });

        return {
            response,
            isShowSignup,
            v$,
            isError,
            checkFormatPassword,
            errorMessage,
            emailValue,
            passwordValue,
            onSignup,
            showSuccessPass,
            resendInstructions,
            resendDisabled,
            resendTime,
            showValidatePass,
            user_signup_id,
            loading,
            isShowNetworkError,
            reloadSignUp,
        };
    },
    beforeRouteLeave(to, from, next) {
        const _this = this;
        _this.passwordValue = '';
        next();
    },
});
</script>

<style lang="scss" scoped>
.auth-signup {
    .verify-account {
        width: 236px;
        height: 100px;
        object-fit: contain;
    }
    .img-error {
        width: 100px;
        height: 100px;
        object-fit: contain;
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
