<template>
    <div class="relative w-full">
        <template v-if="isShowResponse">
            <div class="absolute left-52p top-32p z-999">
                <div @click="reloadForgotPassword" class="cursor-pointer flex items-center">
                    <icon-component name="LongArrowLeft" color="primary-500" class="mr-2p" />
                    <span class="text-primary-500 text-14"> {{ $t('slp.auth_navigate_forgotpassword') }}</span>
                </div>
            </div>
        </template>
        <template v-if="!isShowResponse">
            <router-link
                :to="{ name: 'SignIn' }"
                class="absolute left-52p top-32p z-999 text-14 text-primary-500 cursor-pointer flex items-center"
            >
                <icon-component name="LongArrowLeft" color="primary-500" class="mr-2p" />
                {{ $t('slp.auth_navigate_signin') }}
            </router-link>
        </template>
        <div v-if="!isShowResponse" class="py-168p w-416 mx-auto">
            <h3 class="font-heading text-36 font-semibold text-primary-500">
                {{ $t('slp.forgotpassword_text_reset_password') }}
            </h3>
            <h4 class="text-14 text-neutrals-500 mb-48p" v-html="$t('slp.forgotpassword_enter_registered_email')"></h4>
            <Alert
                v-if="errorValue === 'too_often'"
                :type="'error'"
                class="mb-24p"
                :close="false"
                nameIcon="exclamation-circle"
            >
                <template v-slot:message>
                    <div class="text-14">
                        <p>{{ $t(`slp.forgotpassword_error_too_often`) }}</p>
                    </div>
                </template>
            </Alert>
            <form @submit.prevent="onSubmitEmail">
                <Input
                    :state="
                        (emailValue && !v$.emailValue.validateEmail.$response) || (error && errorValue !== 'too_often')
                            ? 'error'
                            : 'primary'
                    "
                    class="input--auth"
                    v-model="emailValue"
                    placeholder="name@work-email.com"
                >
                    <template v-slot:prefix
                        ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M20.125 5H3.875C2.82031 5 2 5.85938 2 6.875V18.125C2 19.1797 2.82031 20 3.875 20H20.125C21.1406 20 22 19.1797 22 18.125V6.875C22 5.85938 21.1406 5 20.125 5ZM3.875 6.25H20.125C20.4375 6.25 20.75 6.5625 20.75 6.875V8.51562C19.8906 9.21875 18.6406 10.2344 14.8516 13.2422C14.1875 13.7891 12.8984 15.0391 12 15C11.0625 15.0391 9.77344 13.7891 9.10938 13.2422C5.32031 10.2344 4.07031 9.21875 3.25 8.51562V6.875C3.25 6.5625 3.52344 6.25 3.875 6.25ZM20.125 18.75H3.875C3.52344 18.75 3.25 18.4766 3.25 18.125V10.1172C4.10938 10.8594 5.51562 11.9922 8.32812 14.2188C9.14844 14.8828 10.5547 16.2891 12 16.25C13.4062 16.2891 14.8125 14.8828 15.6328 14.2188C18.4453 11.9922 19.8516 10.8594 20.75 10.1172V18.125C20.75 18.4766 20.4375 18.75 20.125 18.75Z"
                                fill="#B4B4BE"
                            />
                        </svg>
                    </template>
                </Input>
                <template v-if="errorValue !== 'email_is_locked' && errorValue !== 'too_often'">
                    <span
                        v-if="(emailValue && !v$.emailValue.validateEmail.$response) || (emailValue && error)"
                        class="inline-block text-error-3 mt-8p"
                    >
                        {{
                            error
                                ? $t(`slp.forgotpassword_error_${errorValue}`)
                                : $t('common.error_invalid_email_format')
                        }}
                    </span>
                </template>
                <template v-if="errorValue === 'email_is_locked' && errorValue !== 'too_often'">
                    <span v-if="emailValue && error" class="inline-block text-error-3 mt-8p">
                        {{ $t('slp.forgotpassword_error_email_is_locked') }}
                        <Button class="btn__contact" type="link" size="large">
                            {{ $t('slp.forgotpassword_error_btn_contact_us') }} </Button
                        >.
                    </span>
                </template>
                <Button
                    :disabled="!v$.emailValue.validateEmail.$response || loading"
                    class="button--auth w-fill mt-48p"
                    @click="onSubmitEmail"
                >
                    <template v-if="!loading">{{ $t('slp.forgotpassword_btn_reset_password') }}</template>
                    <template v-else>
                        <Spinner size="small" color="#fff" />
                    </template>
                </Button>
            </form>
        </div>
        <template v-else>
            <Response v-if="response === 'success'" :srcImg="'images/email-sent.png'">
                <template v-slot:title> {{ $t('slp.forgotpassword_res_title') }} </template>
                <template v-slot:body>
                    <p
                        class="text-14 text-neutrals-400 mt-16p mb-40p"
                        v-html="$t('slp.forgotpassword_res_subtitle', { emailValue })"
                    ></p>
                    <div class="flex items-center justify-center">
                        <span class="text-14 text-neutrals-400">{{ $t('slp.forgotpassword_res_didnt_receive') }}</span>
                        <Button type="link" :disabled="resendDisabled" @click="resendInstructions">
                            {{
                                resendDisabled
                                    ? $t('slp.forgotpassword_res_resend_in_time', { resendTime })
                                    : $t('slp.forgotpassword_res_resend_instructions')
                            }}
                        </Button>
                    </div>
                </template>
            </Response>
            <LoadingScreen v-if="response === 'network_error'" />
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, inject } from 'vue';
import useVuelidate from '@vuelidate/core';
import Response from '../components/AuthResponse.vue';
import LoadingScreen from '../components/AuthLoadingScreen.vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Alert from '@/components/ui/AlertComponent.vue';
import Spinner from '@/components/ui/Spinner.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { useAuth } from '../composables/useAuth';
import { validateEmail } from '@/utils/validate';

export default defineComponent({
    name: 'ForgotPassword',
    validations() {
        return {
            emailValue: { validateEmail },
        };
    },
    components: {
        LoadingScreen,
        Response,
        Button,
        Input,
        Alert,
        Spinner,
        IconComponent,
    },
    setup() {
        const emitter: any = inject('emitter');
        const v$ = useVuelidate();
        const response = ref<string>('network_error');
        const emailValue = ref<string>('');
        const isShowResponse = ref<boolean>(false);
        const errorValue = ref<string>('');
        const { forgotPassword, error, loading } = useAuth();
        const resendDisabled = ref<boolean>(false);
        const resendTime = ref<number>(0);
        const onSubmitEmail = async () => {
            if (v$.value.$invalid) return;
            await forgotPassword({ email: emailValue.value });
            if (error.value?.message === 'Network Error') {
                isShowResponse.value = true;
                response.value = 'network_error';
                return;
            }
            if (error.value !== null) {
                errorValue.value = Object.keys(error.value)[0];
            } else {
                isShowResponse.value = true;
                response.value = 'success';
                errorValue.value = '';
            }
        };
        const resendInstructions = () => {
            resendDisabled.value = true;
            resendTime.value = 30;
            onSubmitEmail();
        };
        const reloadForgotPassword = () => {
            isShowResponse.value = false;
            emailValue.value = '';
        };
        emitter.on('isOnline', (value: boolean) => {
            if (value) {
                isShowResponse.value = false;
                emailValue.value = '';
            }
        });

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
        watch(emailValue, (newVal: string) => {
            if (newVal === '') {
                error.value = null;
                errorValue.value = '';
            }
        });
        return {
            v$,
            isShowResponse,
            emailValue,
            error,
            errorValue,
            loading,
            resendDisabled,
            resendTime,
            response,
            onSubmitEmail,
            forgotPassword,
            resendInstructions,
            reloadForgotPassword,
        };
    },
});
</script>

<style lang="scss" scoped>
.btn__contact {
    padding: 0;
}
</style>
